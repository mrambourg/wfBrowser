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
	
	app.post('/fileExist', isLoggedIn, function(req, res){
		var homeDir=home(req.user._id);
		var trg=path.normalize(homeDir+req.body.file);
		console.log('file Exist '+trg);
		fs.stat(trg, function(err, stat) {
			if(err == null) {
				//file exist
				res.json({msg : 'err est null'});
			} else if(err.code == 'ENOENT') {
				//file doesn't exist
				res.json({msg : 'err est ENOENT'});
			} else {
				//error file path 
				res.json({msg : 'error exist'});				
			}//if err
		});//if stat
	});//end post
	
	
	app.post('/move', isLoggedIn, function(req, res){	
		var homeDir=home(req.user._id);
		var src=path.normalize(homeDir+req.body.src);
		var trg=path.normalize(homeDir+req.body.dir+"/"+path.basename(src));
		var type=req.body.type;
		var force=req.body.force;
		console.log("FFFFF "+force);
		//test si fichier cible existe
		fs.stat(trg, function(err, stat) {
			if(err == null) {
				//file exist
				if (force==1){
					console.log("ecrase le fichier");
					//res.json({msg : 'ecrase Fichier existe'});
					//on efface le fichier arrivé
					wb.sdelete(res,trg,function(){
						// on force la copie
						wb.scutOrCopy(res,src,trg,'cut',function(res,msg){
							console.log(msg);
							res.json(msg);			
						});	
					})
				} else {
					console.log("Demande si on ecrase le fichier");
					res.json({msg : 'File Exist'});
				}
			} else if(err.code == 'ENOENT') {
				//file doesn't exist
				wb.scutOrCopy(res,src,trg,'cut',function(res,msg){
					console.log(msg);
					res.json(msg);			
				});
			} else {
				//error file path 
				res.json({msg : 'error exist'});				
			}//if err
		});//if stat
		
		
		
		/*wb.scutpaste(res,src,trg,function(res,msg){
			console.log(msg);
			res.json(msg);			
		});
		*/
	});//end post
	
	
	
	
	
	app.post('/flushTrash',  	isLoggedIn, 	function(req, res){
		var homeDir=home(req.user._id);
		var trg=path.normalize(homeDir+"../Desktop/Trash/");
		//delete all from Trash
		wb.sdelete(res,trg,function(res,msg){
			//recreate trash directory
			fs.mkdir(trg, function(){
				res.json(msg);
			});
		});
	});//end post
	
	
	app.post('/delete',  	isLoggedIn, 	function(req, res){
		var homeDir=home(req.user._id);
		var file=path.normalize(homeDir+req.body.file);
		var trg=path.normalize(homeDir+"../Desktop/Trash/"+path.basename(file));
		wb.scutpaste(res,file,trg,function(res,msg){
			res.json(msg);	
		});
	});//end post
	
	app.post('/addFile',  	isLoggedIn, 	function(req, res){
		var id=req.user._id;	
		var defaultFileName=req.body.defaultFileName;
		var dir=req.body.dir;
		if( typeof(id) == 'undefined' ){var id=''};
		if( typeof(defaultFileName) == 'undefined' ){var defaultFileName="EmptyFile.txt"};
		var destination=path.normalize(__dirname+'/../../Repository/'+id+"/Data/"+dir+"/"+defaultFileName);
		wb.saddFile(destination,res,function(res){res.json(dir);});
	});//end post

	app.post('/paste',  isLoggedIn, function(req, res){
		var id=req.user._id;	
		var mdata=req.body;
		var elem=req.body.element;
		var type=req.body.type;
		var dir=req.body.dir;
		var homeDir=home(id);
		var src=path.normalize(homeDir+elem);
		var trg=path.normalize(homeDir+"/"+dir+"/"+path.basename(elem));
		wb.scutOrCopy(res,src,trg,type,function(res,msg){
			console.log(msg);
			res.json(msg);			
		});
	});//end post
	
	app.post('/addFolder',  isLoggedIn, 	function(req, res){
		var id=req.user._id;	
		var defaultFileName=req.body.defaultFileName;
		var dir=req.body.dir;
		var homeDir=home(id);
		var newDir=path.normalize(homeDir+"/"+dir+"/"+defaultFileName);
		//fs.mkdir
		 wb.saddFolder(newDir,res,function(res,msg){
			res.json(msg);	
		});
	});//end post
	
	app.post('/loadTemplate',  isLoggedIn, 	function(req, res){
		//return template from views/name.ejs
		var tplName=req.body.name;
		var filename=path.normalize(__dirname+"../../../public/template/"+tplName+".ejs");
		fs.readFile(filename, function (err, data) {
			if (err) throw err;
			res.type('text/plain');
			res.status(200).send(data)
		});
  	});
		
	app.post('/upload',  	isLoggedIn, 	function(req, res){	
		console.log("upload rq.headers "+JSON.stringify(req.headers));
		console.log("upload rq.user "+JSON.stringify(req.user));
		console.log("upload rq.body "+JSON.stringify(req.body));	
		console.log("upload monId "+req.user._id);
		res.status(201).end()}
	);//end post upload
};	//end module.exports

function home(id){
	return path.normalize(__dirname+'/../../Repository/'+id+"/Data/");
}

// route middleware to make sure
function isLoggedIn(req, res, next) {
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();
	// if they aren't redirect them to the home page
	res.redirect('/');
}