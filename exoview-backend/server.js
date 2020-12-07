require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const CLIENT_PORT = process.env.CLIENT_PORT;
const fetch = require('node-fetch');
const parser = require('fast-xml-parser');
const http = require('http').createServer(app).listen(CLIENT_PORT);
const io = require('socket.io')(http);
const cors = require('cors');
const planetSchema = require('./models/planet');
const starSchema = require('./models/star');
const Db = require('./src/db');
const { start } = require('repl');

var defaultUrl =
	'https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+hostname,pl_name,pl_rade,pl_bmasse,pl_bmassj,pl_radj,pl_orbsmax,pl_orbper,pl_orbeccen,disc_year,st_spectype,st_teff,st_rad,st_mass,st_lum,st_age,st_dens,st_rotp,st_radv,ra,dec+from+pscomppars+order+by+disc_year+desc';

var db;

/**
 * Yhdistää tietokantaan, palauttaa promisen joka kertoo yhteyden joko onnistuneen tai epäonnistuneen,
 * mikäli db:n sai tehtyä.
 */
const connectDatabase = async () => {
	console.log('Connecting to database...');

	db = new Db();

	console.log('Creating collections');

	db.setCollection('planets', planetSchema);
	db.setCollection('stars');


	return new Promise((resolve, reject) => {
		var success = db !== undefined;
		success ? resolve('Connection ok.') : reject('Connection failed');
	});
};

/**
 * Hakee datan exoplanet archivesta, onnistuu jos löytyneet planeetat eivät ole undefined
 */
const fetchData = async (props) => {
	const response = await fetch(props);

	const teksti = await response.text();
	const objects = await parser.parse(teksti);

	const planetArray = objects.VOTABLE.RESOURCE.TABLE.DATA.TABLEDATA.TR;
	return new Promise((resolve, reject) => {
		var success = planetArray != undefined;
		success ? resolve(planetArray) : reject('Query failed');
	});
};

/**
 * Parseroi datan tietokantaan, mikäli planeetta löytyy, päivitetään vanha planeetta. Mikäli ei löydy,
 * lisätään tietokantaan uusi.
 */
const parseData = async (data) => {
	
	var foundStars = [];

	//Etsitään datasta planeetat
	for (let i in data) {
		const obj = data[i];
		const planet = obj.TD;

		var starName = planet[0];


		//Etsitään, löytyykö nimellä valmiiksi planeettaa
		var foundPlanetResult = await db.find("planets", {
			searchTerm: planet[1],
			filter: 'pl_name',
			exact_match: 1
		});

		//Etsitään, löytyykö host tähden nimellä tähteä
		var foundStarResult = await db.find("stars", {
			searchTerm: starName,
			filter: "hostname",
			exact_match: 1
		});
		
		var foundPlanet = foundPlanetResult[0];
		var foundStar = foundStarResult[0];


		//Jos planeettaa ei löydy, luodaan uusi entry
		if (foundPlanet === undefined) {
			var planetEntry = {
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
				dateAdded: new Date(),
			};

			//Jos tähteä ei ole olemassa, tarvitaan planeettaan tähden tiedot myöhempää tarkastelua varten
			if (foundStar === undefined) {
				planetEntry = Object.assign(planetEntry, {
					st_spectype: planet[10],
					st_teff: Number(planet[11]),
					st_rad: Number(planet[12]),
					st_mass: Number(planet[13]),
					st_lum: Number(planet[14]),
					st_age: Number(planet[15]),
					st_dens: Number(planet[16]),
					st_rotp: Number(planet[17]),
					st_radv: Number(planet[18]),
					ra: Number(planet[19]),
					dec: Number(planet[20]),
				})
			}


			


			//Jos uutta (undefined) tähteä ei ole vielä tähtien taulukossa, lisätään se sinne
			if (!foundStars.includes(planetEntry.hostname)
				&& foundStar === undefined) {
					foundStars.push(planetEntry.hostname);
			}


			//Lisätään uusi planeetta
			const entry = await db.add("planets", planetEntry);


			//Uuden planeetan info lähetetään soketeille
			const newPlanetInfo = {
				name: entry.pl_name,
				id: entry._id,
			};

			io.emit('new planet', newPlanetInfo);

		} else { 					//Muussa tapauksessa päivitetään tiedot

			var update = {
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
			};

			if (foundStar === undefined) {
				update = Object.assign(update, {
					st_spectype: planet[10],
					st_teff: Number(planet[11]),
					st_rad: Number(planet[12]),
					st_mass: Number(planet[13]),
					st_lum: Number(planet[14]),
					st_age: Number(planet[15]),
					st_dens: Number(planet[16]),
					st_rotp: Number(planet[17]),
					st_radv: Number(planet[18]),
					ra: Number(planet[19]),
					dec: Number(planet[20]),
				})
			}

			//Jos uutta (undefined) tähteä ei ole vielä tähtien taulukossa, lisätään se sinne
			if (!foundStars.includes(update.hostname)
				&& foundStar === undefined) {
					foundStars.push(update.hostname);
			}


			//Muut samaan tähtijärjestelmään kuuluvat planeetat etsitään
			const otherPlanets = await db.find("planets", {searchTerm:starName, filter: "hostname", exact_match: 1});

			//Ensimmäisestä tähdestä otetaan oletustiedot viimeisimmän planeetan tiedoilla
			if (otherPlanets[0]._id === foundPlanet._id && foundStar !== undefined) {
				const starUpdate = {
					st_spectype: planet[10],
					st_teff: planet[11],
					st_rad: planet[12],
					st_mass: planet[13],
					st_lum: planet[14],
					st_age: planet[15],
					st_dens: planet[16],
					st_rotp: planet[17],
					st_radv: planet[18],
					ra: planet[19],
					dec: planet[20],
				}

				//Päivitetään tähti
				db.update("stars", foundStar._id, starUpdate);
			}

			//Päivitetään planeetta
			db.update("planets", foundPlanet._id, update);
		}
	}

	await parseStars(foundStars);
	db.write();
};

/**
 * Tekee löydetyistä tähdistä oman collectionin
 */
const parseStars = async (foundStars) => {
	console.log('Parsing stars...');

	for (let i in foundStars) {
		var starName = foundStars[i];

		var planets = await db.find("planets", {
			searchTerm: starName,
			filter: "hostname",
		});

		var defaultPlanet = planets[0];

		var star = {
			hostname: defaultPlanet.hostname,
			st_spectype: defaultPlanet.st_spectype,
			st_teff: defaultPlanet.st_teff,
			st_rad: defaultPlanet.st_rad,
			st_mass: defaultPlanet.st_mass,
			st_lum: defaultPlanet.st_lum,
			st_age: defaultPlanet.st_age,
			st_dens: defaultPlanet.st_dens,
			st_rotp: defaultPlanet.st_rotp,
			st_radv: defaultPlanet.st_radv,
			ra: defaultPlanet.ra,
			ra: defaultPlanet.ra,
		}

		
		var planetIds = []

		var starKeys = Object.keys(star);

		planets.forEach(planet => {
			
			for (let i = 1; i < starKeys.length; i++) {
				delete planet[starKeys[i]];
			}

			planetIds.push(planet._id);
		})


		star["planets"] = planetIds;
		star["dateAdded"] = new Date();

		db.add("stars", star);
	}

	console.log('Stars parsed.');
}

/**
 * Päivittää datan.
 */
const requestData = () => {
	console.log('Updating data...');

	fetchData(defaultUrl).then((data) => {
		parseData(data);
		console.log('Update done:', new Date());
	});
};

/**
 * Antaa kaikki entryt tietokannasta tarkasteluun
 */
app.get('/planets', (req, res) => {
	res.send(db._collections["planets"]._entries);
});

app.get('/stars', (req, res) => {
	res.send(db._collections["stars"]._entries);
});


/**
 * Etsii id:n perusteella entryn tietokannasta
 */
app.get('/search/id', async (req, res) => {
	const id = req.query.id
	const collection = req.query.from;

	if (id === undefined || collection === undefined) {
		res.set(500);
		res.send();
	}


	db.findEntryById(collection, id)
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.set(500);
			res.send(err);
		})
})
/**
 * Hakee tietokannasta hakuehtojen perusteella elementtejä
 */
app.get('/search', async (req, res) => {
	//console.log('server.js: 282 täällä')
	const filter = req.query.filter;
	const searchTerm = req.query.searchterm;
	var offset = req.query.offset;
	var limit = req.query.limit;
	const sortField = req.query.sortField;
	const sortDirection = req.query.sortDirection;
	const collection = req.query.from;

	console.log("searchTerm: ", searchTerm);

	if (collection === undefined) {
		res.set(500);
		res.send();
	}

	if (offset > limit) {
		limit = undefined;
		offset = undefined;
	}



	var queryParameters = {};

	queryParameters['offset'] = offset;

	queryParameters['limit'] = limit;

	queryParameters['searchTerm'] = searchTerm
	queryParameters['filter'] = filter;

	if (sortField !== undefined || sortDirection !== undefined)
		queryParameters['sort'] = {
			field: sortField,
			direction: sortDirection,
		};

	db.find(collection, queryParameters)
		.then((data) => {
			res.send(data);
			return;
		})
		.catch((err) => {
			res.send(err);
			return;
		});
});

/**
 * Serverin perustoimintojen alustus
 */
const server = app.listen(PORT, async () => {
	console.log('Server running on port ' + PORT);

	await connectDatabase().then(
		(success) => {
			console.log(success);
		},
		(reject) => {
			console.log(reject);
			server.close();
		}
	);

	if (db.fileExists()) {
		db.read();
		requestData();
	}

	else {
		
		console.log('Fetching planet entries...');

		await fetchData(defaultUrl).then((data) => {
			parseData(data);
			console.log('Data parsed.');
		});

	}
	setInterval(requestData, 21600000);
});


app.use(cors());
//app.use(express.json())
