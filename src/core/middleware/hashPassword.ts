

const bcrypt = require('bcryptjs');
const saltRounds = 10;

function hashPassword(req, res, next) {
	if (!req.body || !req.body.password) {return(next())};
	bcrypt.genSalt(saltRounds, (err_salt, salt) => {
	  if(err_salt){return(res.sendStatus(500))};
	  bcrypt.hash(req.body.password, salt, function(err, hash){
		  if(err){return(res.sendStatus(500))};
		  req.body.password = hash;
		  next();
	  })
	})
}

module.exports = hashPassword;
