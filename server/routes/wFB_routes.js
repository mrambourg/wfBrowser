// app/routes.js
var util = require('util');
var fs = require('fs');
var _ = require('underscore');
var path=require("path");

var fInfo=require(fs.realpathSync(__dirname+'/../js/fileLibrary.js'));
var lg=require(fs.realpathSync(__dirname+'/../js/log.js'));
var wb=require(fs.realpathSync(__dirname+'/../js/webBrowser.js'));


module.exports = function(app, passport) {
	
/************** READ DIRECTORY ************/
app.post('/readDirectory',  isLoggedIn,  function(req, res){
	/*
	mObj={dir: dir 	// directory to walk};
	*/
	var id=req.user._id;
	var mObj=req.body;
				
	var homedir=home(id);
	var currentdir=path.normalize( homedir+"/"+mObj.dir);
		
	var sObj={
		dir: currentdir, 	//current directory
		homedir: homedir	//home directory
	};
	wb.ser_readDirectory(res,sObj, returnJSON);
});
	
/************** DELETE FILE ************/
app.post('/delete',  	isLoggedIn, 	function(req, res){
	/*
	mObj={filename: filename	// full file name to delete};
	*/
	var id=req.user._id;
	var mObj=req.body;
		
	var homedir=home(id);
	var src=path.normalize(homedir+mObj.filename);
	var trg=path.normalize(homedir+"../Desktop/Trash/"+path.basename(src));
		
	var sObj={
		src: src, 		//source file
		trg: trg,		//target file
		type: "cut",
		force: 1
	}				
	wb.ser_moveFile(res,sObj,returnJSON);
});//end post


/************** EMPTY TRASH ************/
app.post('/flushTrash',  	isLoggedIn, 	function(req, res){
	/*
	mObj={};
	*/
	var id=req.user._id;
	var mObj=req.body;
	
	var homedir=home(id);
	var trg=path.normalize(homedir+"../Desktop/Trash/");
	
	var sObj={
		trg: trg	//trash Directory
	};
	//delete all from Trash
	wb.ser_delete(res,sObj,function(res,msg){
		fs.mkdir(sObj.trg, function(){res.json(msg);});
	});
});//end post

/************** CREATE REPOSITORY ************/
app.post('/createRepository',  	isLoggedIn, 	function(req, res){
	/*
	mObj={};
	*/
	var id=req.user._id;
	var sObj={
		id: id 	//user id
	};
	wb.ser_createRepository(res,sObj,returnJSON);
});//end post

	
/************** ADD FILE ************/		
app.post('/addFile',  	isLoggedIn, 	function(req, res){
	/*
	mObj={dir: dir,			//where to create file
		  filename: filename	//name for new file};
	*/
	var id=req.user._id;	
	var mObj=req.body;
	
	var filename=mObj.filename;
	var dir=mObj.dir;
	
	var homedir=home(id);
	var destination=path.normalize(homedir+"/"+dir+"/"+filename);
	
	var sObj={
		file: destination 	//user id
	};
	
	wb.ser_addFile(res,sObj,returnJSON);
});//end post


/************** ADD FOLDER ************/	
app.post('/addFolder',  isLoggedIn, 	function(req, res){
	/*
		mObj={dir: dir,		//where to create folder
		filename: filename	//name for new folder
	*/
	var id=req.user._id;	
	var mObj=req.body;
	
	var filename=mObj.filename;
	var dir=mObj.dir;

	var homedir=home(id);
	var destination=path.normalize(homedir+"/"+dir+"/"+filename);
	
	var sObj={
		file: destination 	//user id
	};
	
	 wb.ser_addFolder(res,sObj,returnJSON);
});//end post


/************** LOAD TEMPLATE ************/	
app.post('/loadTemplate',  isLoggedIn, 	function(req, res){
	//return template from views/name.ejs
	/*
	mObj={name: name} //template name
	*/
	var mObj=req.body;
	
	var filename=path.normalize(__dirname+"../../../public/template/"+mObj.name+".ejs");
	fs.readFile(filename, function (err, data) {
		if (err) throw err;
		res.type('text/plain');
		res.status(200).send(data)
	});
});//end post


/************** MOVE ************/	
app.post('/move', isLoggedIn, function(req, res){	
	var homedir=home(req.user._id);
	/*
	var mObj={
		filename:	filename ,	//filename to paste
		dir:		dir,		//where
		type: 	type, 	//cut or copy
		force: 	0		//overwrite or not
	}
	*/
	var mObj=req.body;
	var type=mObj.type;
	var force=mObj.force;
	
	var src=path.normalize(homedir+mObj.filename);
	var trg=path.normalize(homedir+mObj.dir+"/"+path.basename(src));
	
	var sObj={
		src:	src,
		trg:	trg,
		type: type,
		force: force
	}				
	wb.ser_moveFile(res,sObj,returnJSON);
});//end post
	
	


/************************************************************************/
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
	

app.post('/upload',  	isLoggedIn, 	function(req, res){	
	console.log("upload rq.headers "+JSON.stringify(req.headers));
	console.log("upload rq.user "+JSON.stringify(req.user));
	console.log("upload rq.body "+JSON.stringify(req.body));	
	console.log("upload monId "+req.user._id);
	res.status(201).end()}
);//end post upload
};	//end module.exports



/******************** FUNCTIONS ***********************************************/
// return result
function returnJSON(res,data){
	console.log("returnJSON "+JSON.stringify(data));
	res.json(data);
}

// create home dir from id
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