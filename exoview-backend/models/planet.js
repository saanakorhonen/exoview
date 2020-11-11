const mongoose = require('mongoose');


const planetSchema = new mongoose.Schema({
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
})


module.exports = mongoose.model('Planet', planetSchema);