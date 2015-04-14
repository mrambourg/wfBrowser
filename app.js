// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 16365;

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var path = require('path');
var logger = require('morgan');
var multer  = require('multer');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var log=require(__dirname +'/server/js/log.js');
var configDB = require(__dirname +'/server/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require(__dirname +'/server/js/passport')(passport); // pass passport for configuration

	app.use(logger('dev'));	// log every request to the console
	app.use(cookieParser());	// read cookies (needed for auth)

	app.use(bodyParser.json()); // get information from html forms
        app.use(bodyParser.urlencoded({ extended: true }));

    // required for passport
	app.use(session({ secret: '3aAqWWeaNjpX9wBI6gLrvObQ3MEaSfi3P3' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session({pauseStream: true})); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session
		
	app.set('view engine', 'ejs'); 		// set up ejs for templating
	app.set('views', path.join(__dirname, '/public/views'));
	app.engine('html',require('ejs').renderFile);	
	
	// static address
	app.use("/css", 	 	express.static(__dirname + '/public/css'));
    	app.use("/img", 		express.static(__dirname + '/public/img'));
    	app.use("/js", 	 		express.static(__dirname + '/public/js'));
    	app.use("/lib", 	 		express.static(__dirname + '/public/lib'));
	app.use("/fonts",		express.static(__dirname + '/public/fonts'));
	app.use("/template",	express.static(__dirname + '/public/template'));	
	
// routes ======================================================================
require(__dirname +'/server/routes/passport_routes.js')(app, passport); // load identification routes
require(__dirname +'/server/routes/wFB_routes.js')(app, passport);   // load our routes and pass in our app and fully configured passport	
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
