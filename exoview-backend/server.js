require('dotenv').config();
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const mongo = require('mongodb');
const app = express();
const PORT = process.env.PORT;
const fetch = require('node-fetch');
const parser = require('fast-xml-parser');

const planetSchema = require('./models/planet');
const Db = require('./src/db');
const { response } = require('express');
const planet = require('./models/planet');

const dbUrl = process.env.MONGODB_URI;

const dbName = 'planets';


var defaultUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+order+by+disc_year+desc'

var db;

var collection;



const connectDatabase = async () => {
    let collectionName = 'planets'
    var success = true;
    console.log('Connecting to database...');

    db = new Db(planetSchema);

    /*MongoClient.connect(dbUrl, {useUnifiedTopology: true}, async (err, client) => {
        

        //db = client.db(dbName);

        collection = db.collection(collectionName);

        let cList = await db.listCollections({ name: collectionName }).toArray();

        if (cList.length < 1) {
            console.log("Creating collection...");
            db.createCollection(dbName, {
                validator: {
                    $jsonSchema: planetSchema
                },
                //validationLevel: "off",
                //validationAction: "warn"
            });
        }
        

        if (err) {
            success = false;
        }
    })

    
        
    })*/

    return new Promise((resolve, reject) => {
        var success = db !== undefined;
        success ? resolve('Connection ok.') : reject('Connection failed');
    })
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

        //collection.find({pl_name: planet[1]})

        //const foundPlanet = await collection.findOne({pl_name: planet[1]});
        
        var foundPlanet = null;
        if (foundPlanet === null) {
            const planetEntry = {
                hostname: planet[0],
                pl_name: planet[1],
                pl_rade: Number(planet[2]),
                pl_masse: Number(planet[3]),
                pl_bmassj: Number(planet[4]),
                pl_radj: Number(planet[5]),
                pl_orbsmax: Number(planet[6]),
                pl_orbper: Number(planet[7]),
                pl_orbeccen: Number(planet[8]),
                disc_year: planet[9],
                dateAdded: new Date()
            };

            await db.add(planetEntry)
        }

        /*else {
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

            collection.updateOne({_id: foundPlanet._id}, { $set: update })
            .then(() => {
                    //console.log('update ok');
            })
        }*/
        
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
    const filter = req.query.filter;
    const searchTerm = req.query.searchterm;
    const offset = req.query.offset;
    const limit = req.query.limit;

    var queryParameters = {};
    queryParameters[filter] = new RegExp('.*' + searchTerm + '.*', 'gi');
    queryParameters["sort"] = {disc_year: -1};
    

    const result =  await db.find(queryParameters);

    await result.forEach(planet => {
        result.push(planet);
    });

    res.set(200);
    res.send(result);
    //res.send(planet);
    //console.log(planet);
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


const server = app.listen(PORT, async () => {
    console.log('Server running on port ' + PORT);
    
    connectDatabase()
    .then(success => {
        console.log(success);

    }, reject => {
        console.log(reject);
        server.close();
    })

    console.log('Fetching planet entries...');

    await fetchData(defaultUrl)
    .then((data) => {
        parseData(data);
    })

    setInterval(requestData, 21600000);
});