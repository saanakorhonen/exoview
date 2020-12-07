//Validation skeema planeetoille tietokannassa

module.exports = {
	required: ['pl_name', 'dateAdded'],
	properties: {
		hostname: {
			type: 'string',
		},

		pl_name: {
			type: 'string',
		},

		pl_rade: {
			type: 'number',
		},

		pl_masse: {
			type: 'number',
		},

		pl_bmassj: {
			type: 'number',
		},

		pl_radj: {
			type: 'number',
		},

		pl_orbsmax: {
			type: 'number',
		},

		pl_orbper: {
			type: 'number',
		},

		pl_orbeccen: {
			type: 'number',
		},

		disc_year: {
			type: 'string',
		},

		st_spectype: {
			type: 'string',
		},

		st_teff: {
			type: 'number',
		},

		st_rad: {
			type: 'number',
		},

		st_mass: {
			type: 'number',
		},

		st_lum: {
			type: 'number',
		},

		st_age: {
			type: 'number',
		},

		st_dens: {
			type: 'number',
		},

		st_rotp: {
			type: 'number',
		},

		st_radv: {
			type: 'number',
		},

		ra: {
			type: 'number',
		},

		dec: {
			type: 'number',
		},

		dateAdded: {
			type: 'object',
		},
	},
};
