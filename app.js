// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var log=require(__dirname +'/server/js/log.js');

var configDB = require(__dirname +'/server/config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database
require(__dirname +'/server/js/passport')(passport); // pass passport for configuration

app.configure(function() {
	// set up our express application
	app.use(express.logger('dev')); 	// log every request to the console
	app.use(express.cookieParser()); 	// read cookies (needed for auth)
	//app.use(express.bodyParser()); 	// get information from html forms
	app.use(express.json());
	app.use(express.urlencoded());
		
	app.set('view engine', 'ejs'); 		// set up ejs for templating
	app.set('views', __dirname + '/public/views');	
	app.engine('html',require('ejs').renderFile);	
	
	// required for passport
	app.use(express.session({ secret: '3aAqWWeaNjpX9wBI6gLrvObQ3MEaSfi3P3' })); // session secret
	app.use(passport.initialize());
	//app.use(passport.session()); // persistent login sessions
	app.use(passport.session({pauseStream: true}));	
	app.use(flash()); // use connect-flash for flash messages stored in session
	// static address
	app.use("/css", 	 	express.static(__dirname + '/public/css'));
    	app.use("/img", 		express.static(__dirname + '/public/img'));
    	app.use("/js", 	 		express.static(__dirname + '/public/js'));
    	app.use("/lib", 	 		express.static(__dirname + '/public/lib'));
	app.use("/fonts",		express.static(__dirname + '/public/fonts'));
	app.use("/template",	express.static(__dirname + '/public/template'));	
});

// routes ======================================================================
require(__dirname +'/server/routes/passport_routes.js')(app, passport); // load identification routes
require(__dirname +'/server/routes/wFB_routes.js')(app, passport);   // load our routes and pass in our app and fully configured passport	
// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
