const bcrypt = require('bcryptjs');
const name = process.argv[2];
const pword = process.argv[3];
const dburl = process.argv[4];
const email = process.argv[5];
function initAdmin(adminName, password, email){
	console.log('Generating administrator account');
	bcrypt.genSalt(10, (err_salt, salt) => { // same # from /auth/hashPassword.js
		if(err_salt){throw Error(err_salt)};
		bcrypt.hash(password, salt, (err, hash) => {
			if(err){throw Error(err)};
			knex('users').insert({name: adminName,
								  password: hash,
								  email: email,
								  user_type: 2})
			.then( (res) => {console.log('Admin added.')})
			.catch((err) => {throw err})
			.finally( () => { knex.destroy()});
		})
	})
}

var knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: dburl,
    searchPath: ['knex', 'public'],
  });
  

initAdmin(name, pword, email);



