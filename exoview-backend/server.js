require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const PORT = process.env.PORT;
const fetch = require('node-fetch');
const parser = require('fast-xml-parser');

const planetSchema = require('./models/planet');
const { response } = require('express');

const dbUrl = process.env.MONGODB_URI;

const dbName = 'planets';


var defaultUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+order+by+disc_year+desc'

var db;

var collection;



const connectDatabase = () => {
    var success = true;
    console.log('Connecting to database...');

    MongoClient.connect(dbUrl, {useUnifiedTopology: true}, (err, client) => {
        

        db = client.db(dbName);

        collection = db.collection('planets');

        
        if (/*TODO TESTIl*/true) {
            db.createCollection(dbName, {
                validator: {
                    $jsonSchema: planetSchema
                }
            })
        }
        

        if (err) {
            success = false;
        }
    })

    return new Promise((resolve, reject) => {
        success ? resolve('Connection ok.') : reject('Connection failed');
        
    })
}

const databaseExists = (dbName) => {
    return false;
}

const fetchData = async ( props ) => {
    const response = await fetch(props);

    const teksti = await response.text();
    const objects = await parser.parse(teksti);

    const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
    return new Promise((resolve, reject) => {
        var success = planetArray != undefined;
        success ? resolve(planetArray) : reject('Query failed');
    })
}


const parseData = (data) => {
    data.map(async (obj) => {
        const planet = obj.TD;

        collection.find({pl_name: planet[1]})

        const foundPlanet = await collection.findOne({pl_name: planet[1]});
        
        if (foundPlanet === null) {
            const planetEntry = {
                hostname: planet[0],
                pl_name: planet[1],
                pl_rade: planet[2],
                pl_masse: planet[3],
                pl_bmassj: planet[4], // TODO: Tää on aina pl_masse / 317.816
                pl_radj: planet[5],
                pl_orbsmax: planet[6],
                pl_orbper: planet[7],
                pl_orbeccen: planet[8],
                disc_year: planet[9],
                dateAdded: new Date()
            };

            await collection.insertOne(planetEntry)
        }

        else {
            const update = {
                hostname: planet[0],
                pl_name: planet[1],
                pl_rade: planet[2],
                pl_masse: planet[3],
                pl_bmassj: planet[4], // TODO: Tää on aina pl_masse / 317.816
                pl_radj: planet[5],
                pl_orbsmax: planet[6],
                pl_orbper: planet[7],
                pl_orbeccen: planet[8],
                disc_year: planet[9],
            }

            /*collection.updateOne({_id: foundPlanet._id}, update)
            .then(() => {
                    //console.log('update ok');
            })*/
        }
        
    });
}



const requestData = () => {
    console.log('Updating data...');

    fetchData(defaultUrl)
    .then((data) => {
        parseData(data);
        console.log('Update done:', new Date());
    })
}



app.get('/search', async (req, res) => {
    /*const filter = req.query.filter;
    const searchTerm = req.query.searchterm;
    const offset = req.query.offset;
    const limit = req.query.limit;*/

    const planet =  await collection.find({pl_name: /TOI.*/})
    res.send(planet);
    console.log(planet);
    /*.then(result => {
        result.forEach(elem => {
            console.log(elem.pl_name);
        })
        res.send(result);
    })
    .catch(() => {
        res.close();
    });*/
})


const server = app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
    
    connectDatabase()
    .then(success => {
        console.log(success);

    }, reject => {
        console.log(reject);
        server.close();
    })

    console.log('Fetching planet entries...');

    fetchData(defaultUrl)
    .then((data) => {
        parseData(data);
        console.log('Database read');
    })

    setInterval(requestData, 21600000);
});