const fs = require('fs');

const path = './db.dat';

const EMPTY = 0;
const REMOVED = -1;

var Db = class {
    constructor(validator) {
        this._validator = validator;
        this._entries = new Array(10000);
        this._entries.fill(0);
        this._count = 0;

    }

    find({query, sort}) {
        return this._entries;
    }

    async add(entry) {

        if (entry._id !== undefined) {
            var key = this.generateHashKey(entry._id);

            var index = this.findIndexById(key, entry._id);
            this._entries[index] = entry;
        }

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

    generateHashKey(id) {
        var key = 0;

        for (let i in id) {
            key += id.charCodeAt(i);
        }

        return key;
    }

    hash(key, i = 0) {
        var index = key % this._entries.length + i;

        if (this._entries[index] === EMPTY || this._entries[index] === REMOVED) {
            return index;
        }

        return this.hash(key, i + 1);
    }


    findIndexById(key, id, i = 0) {
        var index = key % this._entries.length + i;

        if (this._entries[index] === EMPTY) return undefined;

        if (this._entries[index]._id === id) return index;

        this.findIndexById(key, id, i + 1);
    }

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