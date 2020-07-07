/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * reCaptcha server key: 6LfBRcgUAAAAAIowr8OwpixCYBUGD_3o41o618wA
 * 	
 */
 
const express = require('express');
const router  = express.Router();
const passport = require("passport");

import * as endpoints from '../interfaces/coreEndpoints';
import {Request, Response} from '../interfaces/userInterface';
import AuthController from '../controllers/authController';

var knex = require('knex')({
    client: 'pg',
    debug: false,
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
  });

// Import Auth Controller and Inject Database Connection
let authController = new AuthController();
authController.config({
    knexClient: knex
});

router.post(endpoints.postUserLogin,
  passport.authenticate('local'), (req: Request, res: Response) => {
     res.json({error: false, isAuthenticated: true});
    }
);

router.post(endpoints.postUserLogout, function(req: Request, res: Response) {
    req.logout();
    res.json({error: false, isAuthenticated: false});
});

router.get(endpoints.getUserStatus, authController.getUserStatus);


module.exports = router;
