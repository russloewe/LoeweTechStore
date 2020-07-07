/* filename:     index.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Render the the index.html
 */

var express = require('express');
var router = express.Router();
const model = require('../models/userModel');
const userController = require('../controllers/userController');

var knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
  });
model.config({client: knex});
userController.config({model: model});

router.post('/add', userController.addUser)


module.exports = router;
