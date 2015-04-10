// app/routes.js
var util = require('util');
var fs = require('fs');
var _ = require('underscore');
var path=require("path");

var fInfo=require(fs.realpathSync(__dirname+'/../js/fileLibrary.js'));
var lg=require(fs.realpathSync(__dirname+'/../js/log.js'));
var wb=require(fs.realpathSync(__dirname+'/../js/webBrowser.js'));


module.exports = function(app, passport) {
	app.post('/readDirectory',  	isLoggedIn,  	function(req, res){wb.sreadDirectory(req,res)});
	app.post('/createRepository',  	isLoggedIn, 	function(req, res){wb.screateRepository(req,res)});
};	//end module.exports
	

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}