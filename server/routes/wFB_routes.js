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

	app.post('/upload',  	isLoggedIn, 	function(req, res){
		console.log("test "+JSON.stringify(req.file));
		console.log("\n body "+JSON.stringify(req.headers));
		//var actualPath=req.files.file.path;
		//var filename=req.files.file.filename;
		//var monId=req.headers.id;
		//console.log("monId "+monId);
		
		
		
		console.log("UPLOAD POST");
		res.status(201).end()
		/*
		//on recupere l'info id passé dans le header
		
		
	
		//on renomme le fichier et on le met dans upload
		fs.readFile(actualPath, function (err, data) {
			var newPath = __dirname + "/upload/"+filename;
			console.log("\n newPath "+newPath);
			fs.writeFile(newPath, data, function (err) {
				res.redirect("back");
			});//end fs.writeFile
		});//end fs.readFile
		*/
		
	});//end post upload
	
	

	
	
};	//end module.exports
	

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}