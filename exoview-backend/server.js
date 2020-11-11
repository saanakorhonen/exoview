require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT;
const fetch = require('node-fetch');
const parser = require('fast-xml-parser');

const Planet = require('./models/planet');
const { response } = require('express');

const dbUrl = process.env.MONGODB_URI;


var defaultUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+order+by+disc_year+desc'



const connectDatabase = () => {
    var success = true;
    console.log('Connecting to database...');
    mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true})
    .catch(err => {
        console.log(err);
        success = false;
    })

    return new Promise((resolve, reject) => {
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
    data.map(obj => {
        const planet = obj.TD;

        Planet.find({pl_name: planet[1]})
        .then(result => {

            if (result[0] === undefined) {


                const planetEntry = new Planet({
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
                })
        
                planetEntry.save().catch(err => {
                    console.log('Save failed:', err);
                })
            }
            

            else {
                var oldPlanet = result[0];

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
    
                Planet.findByIdAndUpdate(oldPlanet._id, update, {useFindAndModify: false})
                .then(() => {
                    console.log('update ok');
                })
                .catch(err => {
                    console.log('update failed: ',err);
                });

            }
        })
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



app.get('/search', (req, res) => {
    const filter = req.query.filter;
    const searchTerm = req.query.searchterm;
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