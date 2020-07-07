var db = require("./db/db_users.js");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
//Call this function to set the admin's user password with bcrypt
bcrypt.genSalt(saltRounds, function(err1, salt){
	bcrypt.hash('passwordhere', salt, function(err2, hash){
		console.log("hash: "+hash);
		console.log("salt: "+salt);
		user={ user_id: 1,
			   password: hash};
	    db.updateUserPassword(user, function(err3, rus){
			if(err3){
				console.log(err3);
			}
		})
	})
})
