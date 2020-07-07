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


/* GET  index  */
router.get(/.*$/, function(req, res, next) {

  const context = {NONCE: res.locals.nonce,
                  SITE_URL: process.env.SITE_URL};
  res.render('index.pug', context);
});

module.exports = router;