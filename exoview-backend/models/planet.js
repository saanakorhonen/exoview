//const mongoose = require('mongoose');


/*const planetSchema = new mongoose.Schema({
    hostname: String,
    pl_name: String,
    pl_rade: Number,
    pl_masse: Number,
    pl_bmassj: Number,
    pl_radj: Number,
    pl_orbsmax: Number,
    pl_orbper: Number,
    pl_orbeccen: Number,
    disc_year: Number,
    dateAdded: Date
})*/

/* "hostname", "pl_rade", "pl_masse", "pl_bmassj", "pl_radj", "pl_orbsmax", "pl_orbper", "pl_orbeccen", "disc_year",*/

module.exports = {
    required: ["pl_name", "dateAdded"],
    properties: {
        
        hostname: {
            bsonType: "string"
        },

        pl_name: {
            bsonType: "string"
        },

        pl_rade: {
            bsonType: "double"
        },

        pl_masse: {
            bsonType: "double"
        },

        pl_bmassj: {
            bsonType: "double"
        },

        pl_radj: {
            bsonType: "double"
        },

        pl_orbsmax: {
            bsonType: "double"
        },

        pl_orbped: {
            bsonType: "double"
        },

        pl_orbeccen: {
            bsonType: "double"
        },

        disc_year: {
            bsonType: "string"
        },

        dateAdded: {
            bsonType: "date"
        }

    }
}
