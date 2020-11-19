const fs = require('fs');

const path = './db.dat';

const EMPTY = 0; //Tyhjä paikka entrylle
const REMOVED = -1; //Poistetun entryn signaali


//Tietokantaluokka
var Db = class {
    constructor(validator) {
        this._validator = validator;
        this._entries = new Array(10000);
        this._entries.fill(0);
        this._count = 0;

    }


    /**
     * Etsii planeetan annettujen tietojen perusteella, järjestää planeetan sort-objektin perustteella.
     * Palauttaa lopuksi halutun määrän planeettoja.
     */
    async find({searchTerm, filter, sort = {field: "disc_year", direction:-1}, offset = 0, limit = this._count}) {
        
        if (searchTerm !== undefined && filter !== undefined) 
            var foundResults = this._entries.filter(entry => {
                return searchTerm.test(entry[filter]);
            })

        else foundResults = this._entries;


    
        var sortField = sort.field;
        var sortDirection = sort.direction;

        foundResults.sort((a, b) => {
            return this.sortResults(a, b, sortField, sortDirection);
        })

        var results = foundResults.slice(offset, limit);


        return new Promise((resolve, reject) => {
            var success = results !== undefined;

            success ? resolve(results) : reject('.find() failed', console.trace());
        })
    }


    //Sort-funktio. Sorttaa entryt annetun kentän perusteella ja antaa suunnan.
    sortResults(a, b, sortField, sortDirection) {
        var compare1 = a[sortField];
        var compare2 = b[sortField];

        if (typeof(compare1 === 'string')) {
            if (compare1 < compare2) {
                return -1 * sortDirection;
            }

            if (compare1 == compare2) {
                return 0;
            }

            if (compare1 > compare2) {
                return 1 * sortDirection;
            }
        }

        return (compare1 - compare2) * sortDirection;
        
    }


    /**
     * Päivittää yhden entryn id:n ja annetun materiaalin perusteella.
     */
    async update(id, update) {
        var success = true;

        var hashKey = this.generateHashKey(id);

        var index = this.findIndexById(hashKey, id);

        if (index === undefined) success = false;
        else {
            var keys = Object.keys(update);

            for (let i in keys) {
                this._entries[index][keys[i]] = update[keys[i]];
            }
        }

        return new Promise((resolve, reject) => {
            success ? resolve('Update ok.') : reject('Update failed');
        })
    }


    //Lisää uuden entryn, generoi sille id:n ja sen perusteella indeksin.
    async add(entry) {

        try {
            await this.validateEntry(entry);
            let id = this.generateId();

            entry._id = id;

            var key = this.generateHashKey(id);

            var index = this.hash(key);

            this._entries[index] = entry;

            this._count++;
        } 
        catch (err) {
            console.log("Entry adding failed:", err);
        }
    }


    /**
     * Removes and pops an entry by id
     * @param {*} id id of the entry to remove
     */
    async pop(id) {
        const hashKey = this.generateHashKey(id);

        var index = this.findIndexById(hashKey, id);

        var removedEntry;
        if (id !== undefined) {
            removedEntry = this._entries[index];
            this._entries[index] = -1;
        }

        return new Promise((resolve, reject) => {
            var success = id !== undefined;
            success ? resolve(removedEntry) : reject(undefined)
        })
    }


    //Generoi hajautuksen tarvittavan avaimen id:n perusteella.
    generateHashKey(id) {
        var key = 0;

        for (let i in id) {
            if (i == 0) {
				key = id.charCodeAt(i);
			} else {
				let sum = id.charCodeAt(i) + id.charCodeAt(i - 1);
				let diff = id.charCodeAt(i) - id.charCodeAt(i - 1);
				if (diff == 0) diff = 1;
				key += id.charCodeAt(i) * Math.floor(Math.abs(sum / diff));
			}
        }

        return key;
    }


    //Generoi indeksin annetun avaimen perusteella hajautusfunktiota käyttäen.
    hash(key, i = 0) {
        var index = (key + 13 * i + 93 * i * i) % this._entries.length;

        if (this._entries[index] === EMPTY || this._entries[index] === REMOVED) {
            return index;
        }

        return this.hash(key, i + 1);
    }


    //Etsii entryn indeksin hash-avaimen ja id:n perusteella.
    findIndexById(key, id, i = 0) {
        var index = (key + 13 * i + 93 * i * i) % this._entries.length + 1;

        if (this._entries[index] === EMPTY) return undefined;

        if (this._entries[index]._id === id) return index;

        this.findIndexById(key, id, i + 1);
    }


    //Validoi annetun entryn muodostettaessa annetun validaattorin perusteella.
    async validateEntry(entry) {
        var validated = true;

        let entryKeys = Object.keys(entry);

        for (let i in this._validator.required) {
            if (!entryKeys.includes(this._validator.required[i]))
                validated = false;
        }

        if (validated) {

            for (let i = 0; i < entryKeys.length; i++){

                var key = entryKeys[i];

    
                var validatorProperty = this._validator.properties[entryKeys[i]];
    
                if (typeof(entry[key]) !== validatorProperty.type) {
                    console.log("type: " + typeof(entry[key]) + " validator: " + validatorProperty.type);
                    validated = false;
                    break;
                }
            }
        }

        return new Promise((resolve, reject)  => {
            validated ? resolve('Validation ok.') : reject('Document not validated:');
        })
    }

    
    //Generoi uniikin id:n yhdelle entrylle.
    generateId() {
        const characters = '1234567890abcdefghijklmnopqrstuvwxyz';

        const length = 16;

        let i = 0;

        var id = '';

        while (i < length) {
            id = id + characters[Math.floor(Math.random() * characters.length)];
            i++;
        }

        return id;
    }
}

module.exports = Db;