require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const fetch = require('node-fetch');
const parser = require('fast-xml-parser');

const planetSchema = require('./models/planet');
const Db = require('./src/db');


var defaultUrl = 'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year+from+pscomppars+order+by+disc_year+desc'

var db;




/**
 * Yhdistää tietokantaan, palauttaa promisen joka kertoo yhteyden joko onnistuneen tai epäonnistuneen,
 * mikäli db:n sai tehtyä.
 */
const connectDatabase = async () => {
    console.log('Connecting to database...');

    db = new Db(planetSchema);


    return new Promise((resolve, reject) => {
        var success = db !== undefined;
        success ? resolve('Connection ok.') : reject('Connection failed');
    })
}


/**
 * Hakee datan exoplanet archivesta, onnistuu jos löytyneet planeetat eivät ole undefined
 */
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


/**
 * Parseroi datan tietokantaan, mikäli planeetta löytyy, päivitetään vanha planeetta. Mikäli ei löydy,
 * lisätään tietokantaan uusi.
 */
const parseData = (data) => {
    data.map(async (obj) => {
        const planet = obj.TD;

        var search = new RegExp('.*' + planet[1] + '.*', 'gi')
        
        var foundPlanetResult =  await db.find({searchTerm: search, filter:"pl_name"}) //jotain
        var foundPlanet = foundPlanetResult[0];

        if (foundPlanet === undefined) {
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

            db.update(foundPlanet._id, update);

        }
        
    });
}


/**
 * Päivittää datan.
 */
const requestData = () => {
    console.log('Updating data...');

    fetchData(defaultUrl)
    .then((data) => {
        parseData(data);
        console.log('Update done:', new Date());
    })
}


/**
 * Antaa kaikki entryt tietokannasta tarkasteluun
 */
app.get('/', (req,res) => {
    res.send(db._entries);
})


/**
 * Hakee tietokannasta hakuehtojen perusteella planeettoja
 */
app.get('/search', async (req, res) => {
    const filter = req.query.filter;
    const searchTerm = req.query.searchterm;
    const offset = req.query.offset;
    const limit = req.query.limit;
    const sortField = req.query.sortField;
    const sortDirection = req.query.sortDirection;

    var queryParameters = {};

    queryParameters["offset"] = offset;
    
    queryParameters["limit"] = limit;

    queryParameters["searchTerm"] = new RegExp('.*' + searchTerm + '.*', 'gi');
    queryParameters["filter"] = filter;
    
    if( sortField !== undefined || sortDirection !== undefined) queryParameters["sort"] = {
        field: sortField,
        direction: sortDirection
    }
    

    db.find(queryParameters)
    .then(data => {
        
        res.set(200);
        res.send(data);
    })
    .catch(err => {
        res.set(500);
        res.send(err);
    })
})


/**
 * Serverin perustoimintojen alustus
 */
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
        console.log('Data parsed.');
    })

    setInterval(requestData, 21600000);
});