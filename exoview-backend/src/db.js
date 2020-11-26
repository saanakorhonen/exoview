const { resolveCname } = require('dns');
const fs = require('fs');
const Collection = require('./collection');

const FILENAME = 'db.json'



//Tietokantaluokka
var Db = class {
    constructor(path = './') {
        this._collections = {};

        this._path = path+FILENAME;
    }


    fileExists() {
        return fs.existsSync(this._path);
    }

    async read() {
        if (!fs.existsSync(this._path)) {
            fs.writeFile(this._path, JSON.stringify(this._collections), (err) => {

                if (err) throw err;
            });

            return;
        }


        var data = await fs.readFileSync(this._path);
        var collections = JSON.parse(data);

        var keys = Object.keys(collections);

        for (let i in keys) {
            var collectionData = collections[keys[i]];

            this._collections[keys[i]]._entries = collectionData._entries;
            this._collections[keys[i]]._count = collectionData._count;
        }
    }

    

    write() {
        fs.writeFileSync(this._path, JSON.stringify(this._collections));
    }

    /**
     * Luo tietokantaan uuden collectionin
     * Tarvitsee nimen ja validaattorin
     * Ei tee mitään jos saman niminen collection on jo olemassa.
     */
    setCollection(name, validator) {
        if (this._collections[name] !== undefined) return;

        this._collections[name] = new Collection(name, validator);
        return this._collections[name];
    }

    /**
     * Hakee tietoa collectionista
     * Tarvitsee collectionin nimen
     * ja parametrit
     */
    async find(collection, parameters) {
        var promise = await this._collections[collection].find(parameters);
        return promise;
    }


    async add(collection, entry) {
        var promise = await this._collections[collection].add(entry);
        return promise;
    }


    async pop(collection, id) {
        var promise = await this._collections[collection].pop(id);
        return promise;
    }

    async update(collection, id, update) {
        var promise = await this._collections[collection].update(id, update);
        return promise;
    }


    async findEntryById(collection, id) {
        var promise = await this._collections[collection].findEntryById(id);

        return promise;
    }


    getCollection(name) {
        return new Promise((resolve, reject) => {
            var success = this._collections[name] != undefined;
            success ? resolve(this._collections) : reject('Collection not found');
        });
    }
}

module.exports = Db;