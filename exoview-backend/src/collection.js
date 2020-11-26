const EMPTY = 0; //Tyhjä paikka entrylle
const REMOVED = -1; //Poistetun entryn signaali

var Collection = class {
    constructor(name, validator) {
        this._validator = validator;
        this._entries = new Array(10000);
        this._entries.fill(0);
        this._count = 0;
        this._name = name;
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

        else var foundResults = this._entries.filter( (entry) => (entry !== 0 && entry !== -1) );

        var sortField = sort.field;
        var sortDirection = sort.direction;

        foundResults.sort((a, b) => {
            return this.sortResults(a, b, sortField, sortDirection);
        })

        var results = foundResults.slice(offset, limit);

        console.log(results);

        return new Promise((resolve, reject) => {
            var success = results !== undefined;

            success ? resolve(results) : reject('.find() failed', console.trace());
        })
    }


    /**
     * Sort-funktio. Sorttaa entryt annetun kentän perusteella ja antaa suunnan.
     */
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
            success ? resolve('Update ok.') : reject('Update failed', console.trace());
        })
    }


    //Lisää uuden entryn, generoi sille id:n ja sen perusteella indeksin.
    async add(entry) {
        var success = true;


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
            success = false;
        }

        return new Promise((resolve, reject) => {
            success ? resolve(entry) : reject(undefined)
        })
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
            this._count--;
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
    hash(key) {
        var i = 0;
        var index = 0;

        var spaceFound = false;

        do {
            index = (key + 13 * i + 93 * i * i) % this._entries.length;

            i++;

            if (this._entries[index] === EMPTY || this._entries[index] === REMOVED)
                spaceFound = true;
        } while (!spaceFound)

        return index;

        /*var index = (key + 13 * i + 93 * i * i) % this._entries.length;

        if (this._entries[index] === EMPTY || this._entries[index] === REMOVED) {
            return index;
        }

        return this.hash(key, i + 1);*/
    }


    //Etsii entryn indeksin hash-avaimen ja id:n perusteella.
    findIndexById(key, id) {
        var i = 0;

        var index = 0;

        do {
            index = (key + 13 * i + 93 * i * i) % this._entries.length;
            i++;

            if(this._entries[index] === EMPTY) return undefined;

            if(this._entries[index]._id === id) break;
        } while (id !== this._entries[index])

        return index;

        /*console.log("äälllä: " + key + " " + id + " " + i + " collection nimi: " + this._name);
        var index = (key + 13 * i + 93 * i * i) % this._entries.length;

        if (this._entries[index] === EMPTY) {
            console.log("Slot empty: " + this._entries[index]._id + " looking for " + id);
            return undefined;
        };

        if (this._entries[index]._id === id) {
            console.log('indeksi löytyi')
            return index;
        } 

        //console.log("collection.js:190 compared: " + this._entries[index]._id + " with " + id);

        //this.findIndexById(key, id, i + 1);*/
    }


    async findEntryById(id) {
        var key = this.generateHashKey(id);

        var index = this.findIndexById(key, id);

        return new Promise((resolve, reject) => {
            var success = index !== undefined;
            success ? resolve(this._entries[index]) : reject ('Not found');
        });
    }


    //Validoi annetun entryn muodostettaessa annetun validaattorin perusteella.
    async validateEntry(entry) {
        if (this._validator === undefined) return new Promise((resolve, reject) => {
            resolve('Validation ok');
        })

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
                    console.log("Key:" + entryKeys[i] + " type: " + typeof(entry[key]) + " validator: " + validatorProperty.type);
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

module.exports = Collection;