import express from 'express';
import path from 'path';
var app = express();

//verify node environment
var env = process.env.NODEENV ;
console.log("Node env: - " + env);
//set up compression
import compression from 'compression';
app.use(compression());

//set up json 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



//set up body parser
const bodyParser = require("body-parser")
app.use(bodyParser.text());


app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}))


if(process.env.ENV == 'prod'){
  console.log('Using CSP headers');
  const csp = require(`helmet-csp`);

  app.use(csp({
    // Specify directives as normal.
    directives: {
      defaultSrc: ["'self'",'js.stripe.com', 'default.com'],
      scriptSrc: ["'self'", 'https://js.stripe.com',  'https://connect.facebook.net',
                  'https://www.google-analytics.com', "'unsafe-inline'"],
      styleSrc: ["'self'", 'https://connect.facebook.net', 'style.com', "'unsafe-inline'"],
      connectSrc: ["'self'", 'https://js.stripe.com'],
      frameSrc: ['https://js.stripe.com', 'https://hooks.stripe.com'],
      fontSrc: ["'self'", 'fonts.com'],
      imgSrc: ["'self'", 'https://www.google-analytics.com', 'data:'],
      sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
      reportUri: '/report-violation',
      objectSrc: ["'none'"],
      upgradeInsecureRequests: true,
      workerSrc: false  // This is not set.
    },
  
    // This module will detect common mistakes in your directives and throw errors
    // if it finds any. To disable this, enable "loose mode".
    loose: false,
  
    // Set to true if you only want browsers to report errors, not block them.
    // You may also set this to a function(req, res) in order to decide dynamically
    // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
    reportOnly: false,
  
    // Set to true if you want to blindly set all headers: Content-Security-Policy,
    // X-WebKit-CSP, and X-Content-Security-Policy.
    setAllHeaders: false,
  
    // Set to true if you want to disable CSP on Android where it can be buggy.
    disableAndroid: false,
  
    // Set to false if you want to completely disable any user-agent sniffing.
    // This may make the headers less compatible but it will be much faster.
    // This defaults to `true`.
    browserSniff: true
  }))
  
  app.post(
    '/report-violation',
    bodyParser.json({
      type: ['json', 'application/csp-report']
    }),
    (req, res) => {
      if (req.body) {
        console.log('csp violation: ', req.body)
      } else {
        console.log('csp violation: no data received!')
      }
      res.status(204).end()
    }
  )
}


//set up csp
//const reportRouter = require('./csp.js').reportRouter;
//const generateNonce = require('./csp.js').generateNonce;
//const csp = require('./csp.js').csp;
//app.use(generateNonce)
//app.use(csp)
//app.use('/csp', reportRouter);

//set up express-sessions with Postgres Database
const session = require('express-session');
var PostgreSqlStore = require('connect-pg-simple')(session);
var sessionOptions = {
  secret: "oeuoesecret",
  resave : true,
  saveUninitialized : true,
  store : new PostgreSqlStore({
    conString: process.env.DATABASE_URL // database url from environment
  })
};
app.use(session(sessionOptions));

//set up passport
const passport = require('./middleware/passport');
app.use(passport.initialize());
app.use(passport.session());


// import ensureAdmin
const mwOptions =  { 
                userLevel: 2}
const ensureAdmin = require('./middleware/ensureAdmin')(mwOptions);

// import captcha middleware
//const recapMW = require('./middleware/captchaMiddleware');  
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set up logger
const logger = require('morgan');
app.use(logger('dev'));

//set up rate limiter
const rateLimit = require("express-rate-limit");
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});

const authRouter = require('./routes/authRouter');
//const mailRouter =  require('./routes/mailerRouter');
const usersRouter = require('./routes/userRouter');
//const racRouter = require('./routes/racRouter');
//const recaptchaRouter = require('./routes/captchaRouter');
const storeRouter = require('./routes/storeRouter');
const indexRouter = require('./routes/indexRouter');


app.use(storeRouter);
app.use(apiLimiter,  authRouter);  
//app.use('/mail/', recapMW,  mailRouter ); 
app.use('/users/', ensureAdmin, usersRouter);
//app.use('/rac/', racRouter); 
//app.use('/captcha/', recaptchaRouter); 
app.use('/public/', express.static(path.join(__dirname, 'public'))); 
app.use('/private/', ensureAdmin, express.static(path.join(__dirname, 'private')));
app.use(/.*\/*$/, indexRouter);


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};
  console.log(err);
  // render the error page
  res.status(err.status || 500);
  res.end();
});



module.exports = app;
