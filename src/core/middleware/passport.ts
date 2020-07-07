const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
import {User} from '../interfaces/userInterface';


var knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
  });
const model = require('../models/userModel');
model.config({client: knex});


interface Message{
    message: string;
}
interface Callback{
    (error: boolean, user: User | boolean | number, message?: Message): any;
};

passport.serializeUser(function(user: User, done: Callback) {
    done(null, user.user_id);
});

passport.deserializeUser(async function(id: number, done: Callback) {
  let user;
  try{
    var users = await knex('users').where('user_id', id);
    user = users[0];
  }catch(err){
    return(done(err, null));
  }

  let user_info: User = {user_id: user.user_id,
                name: user.name,
                email: user.email,
                user_type: user.user_type}

  done(null, user_info);
});
        
passport.use(new LocalStrategy(async (username: string, password: string, done: Callback) => {
  let users;
  try{
    users = await knex('users').where('name', username);
  }catch(err){
    return done(null, false, {message: 'DB error'})
  }
  
  let user;
  try{
    user = users[0];
  }catch(err){
    return done(null, false, { message: 'Incorrect username or password.' });
  }
    
  if (!bcrypt.compareSync(password, user.password)) {
    return done(null, false, { message: 'Incorrect password or username.' });
  }else{
    return done(null, user);
  }
  }
));


module.exports = passport;
