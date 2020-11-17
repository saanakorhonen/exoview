//Validation skeema planeetoille tietokannassa

module.exports = {
    required: ["pl_name", "dateAdded"],
    properties: {
        
        hostname: {
            type: "string"
        },

        pl_name: {
            type: "string"
        },

        pl_rade: {
            type: "number"
        },

        pl_masse: {
            type: "number"
        },

        pl_bmassj: {
            type: "number"
        },

        pl_radj: {
            type: "number"
        },

        pl_orbsmax: {
            type: "number"
        },

        pl_orbper: {
            type: "number"
        },

        pl_orbeccen: {
            type: "number"
        },

        disc_year: {
            type: "string"
        },

        dateAdded: {
            type: "object"
        }

    }
}
