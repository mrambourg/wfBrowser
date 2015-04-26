var fs = require('fs');
var fse= require("fs.extra");
var path = require('path');
var _ = require("underscore");
var ncp = require('ncp').ncp;
var formidable = require('formidable'); //upload

var lg=require('./log.js');
var fInfo=require('./fileLibrary.js');

/**************** COPY, CUT AND PASTE ****************/
var sdelete=function(res,trg,cb){
	fse.rmrf(trg, function (err) {
		if (err) {console.error(err);}
		cb(res,{msg:"Empty Trash"});	
	});
};


/**************** COPY, CUT AND PASTE ****************/
/*var scutOrCopy=function(res,src,trg,type,cb){
	console.log("scutOrCopy");
	if (type==="cut"){
		console.log("scutpaste");		
		scutpaste(res,src,trg,function(res,msg){cb(res,msg);});
	} else {
		console.log("scopypaste");				
		scopypaste(res,src,trg,function(res,msg){cb(res,msg);});
	}
};
*/
var scutOrCopy=function(res,src,trg,type,cb){
	console.log("scutOrCopy");
	if (type==="cut"){
		console.log("scutpaste");		
		scutpaste(res,src,trg,function(res,msg){cb(res,msg);});
	} else {
		console.log("scopypaste");				
		scopypaste(res,src,trg,function(res,msg){cb(res,msg);});
	}
};






var scutpaste=function(res,src,trg,cb){
	fs.stat(trg, function(err, stat) {
		if(err == null) {
			cb(res,{msg : "Error file exist"});	
		} else {
			fse.move(src,trg, function (err) {
				if (err) {throw err;}
				cb(res,{msg : "Moved files"});
			});//end fse.move
		}//end if
	});//end fs.stat
};//end scutpaste

var scopypaste=function(res,src,trg,cb){
	fs.stat(trg, function(err, stat) {
		if(err == null) {
			cb(res,{msg : "Error file exist"});	
		} else {
			fse.copy(src,trg, {replace: true},function (err) {
				if (err) {throw err};
				cb(res,{msg : "Copied files"});
			});//end fse.copy
		}//end if
	});//end fs.stat
};//end scutpaste

/**************** ADD FILE ****************/
var saddFile=function (file,res,cb){
	// test if default file exist or not
	fs.stat(file, function(err, stat) {
		if(err == null) {
			//recursive call if file name existe
			var newFilename=incFileNb(file);
			saddFile(newFilename,res,cb);
		} else if(err.code == 'ENOENT') {
			// create new file
			fs.writeFile(file, "", function(){
				console.log("ENOENT "+file);
				return cb(res)
				//res.json({msg:"Repository created ",dir: dir});
			});
		} else {
			console.log('Some other error: ', err.code);
		}//end if
	});//end stats
}

var saddFolder=function (file,res,cb){
	// test if default file exist or not
	fs.stat(file, function(err, stat) {
		if(err == null) {
			//recursive call if file name existe
			var newFilename=incFolderNb(file);
			saddFolder(newFilename,res,cb);
		} else if(err.code == 'ENOENT') {
			// create new file
			fs.mkdir(file, function(){
				console.log("ENOENT "+file);
				return cb(res,{msg:"new repository created"})
				//res.json({msg:"Repository created ",dir: dir});
			});
		} else {
			console.log('Some other error: ', err.code);
		}//end if
	});//end stats
}



/**************** READ DIRECTORY ****************/
var sreadDirectory=function (req,res){
	/*get request informations*/
	console.log("sreadDirectory");
	lg.logfunction(req);
	lg.log("sTestFunction "+JSON.stringify(req.body));
	/* filter data from entrance */
	var mydir= fi_readDirectory(req);
	var id=req.user._id;
	//console.log("mydir " +mydir);
	var homedir=path.normalize( __dirname + '../../../Repository/'+id+'/Data');
		
	/* walk throw the directory */
	fInfo.walk(mydir,1,function(err, results){
		if (err){lg.logError(err)};
		var mesRes=[];
		//lg.log("nbre resultats 1 "+results.length);
		// defined parent directory
		var pDir=path.normalize( mydir + '/..' );
		
		//test parent directory
		if(pDir.split("/").length>=homedir.split("/").length){
			var mici={
				filename: pDir,
				dirname:  pDir,
				basename: "..",
				extension: "Directory",
				type:     "Directory",
				size:     0
			};
			mesRes.push(mici);
		}
					
		if (results.length===0){
			// si repertoire est vide, on retourne que le parent
			mesRes=fo_readDirectory(mesRes,homedir);
			res.json(mesRes);
		} else {
			//si le repertoire n'est pas vide, on recupere les infos
			fInfo.fileinfo(results,function(err,mesResultats){
				mesRes=_.union(mesRes,mesResultats);
				mesRes=fo_readDirectory(mesRes,homedir);
				//console.log(JSON.stringify(mesRes));
				res.json(mesRes);
			});
		} // fin de si repertoire vide - retourne les donnees	
	}) ; //fin de walk
};//end function


/* filter in function of sreadDirectory */
function fi_readDirectory(req){
	/* if directory not defined */
	var id=req.user._id;
	var homedir=path.normalize( __dirname + '../../../Repository/'+id+"/Data");
	var currentdir=path.normalize( homedir+"/"+req.body.directory);
	
	var homeSplit=homedir.split("/");
	var currentSplit=currentdir.split("/");
		
	//test deep of currentdir and homedir
	if(homeSplit.length>currentSplit.length){currentdir=homedir}
	console.log("currentdir CheckLength"+currentdir);
	
	//test same deep but different parent directory
	//console.log("currentSplit "+currentSplit[currentSplit.length-1]);
	//if((homeSplit.length=currentSplit.length)&&(currentSplit[currentSplit.length-2]!=req.body.id)){currentdir=homedir}
	//console.log("lastdir "+currentdir);
		
	return currentdir;
}/* end function */

/* filter out function of sreadDirectory  */
var fo_readDirectory=function(mRes,homedir){
	/* replace HOMEDIR by $PATH */
	for (i=0;i<mRes.length;i++){
		mRes[i]["id"]=i;
		mRes[i].dirname=mRes[i].dirname.replace(homedir, "");
		mRes[i].filename=mRes[i].filename.replace(homedir, "");
		/* omit undesired field */
		mRes[i]=_.omit(mRes[i],'uid','dev','mode','nlink','gid','rdev','blksize','ino','blocks','atime','ctime','isDirectory','isFile','isBlockDevice','isCharacterDevice','isSymbolicLink','isFIFO','isSocket','_checkModeProperty');
	}/*end for */
	//console.log(JSON.stringify(mRes))
	return mRes;
}/* end function */


/**************** CREATE Repository ****************/
function screateRepository(req, res){
	//console.log("test "+JSON.stringify(req.body));
	//console.log("user "+JSON.stringify(req.user));	
	var id=req.user._id;
	console.log("id "+id);
	var dirM=path.normalize(__dirname+'/../../Repository/'+id);
	var dirname=fs.realpath(dirM,function (err, resolvedPath) {
		if (err) {
			//repository doesn't exist we create it	
			fs.mkdir(dirM,function(){
			//copy default directory
				ncp.limit = 16;
				var source=path.normalize(__dirname+'/../../Repository/default');
				ncp(source, dirM, function (err) {
					if (err) {
						return console.error(err);
					}
					console.log("Repository created");
					res.json({msg:"Repository created",id: id});
				});//end ncp
			});//end fs.mkdir
		} else {
			console.log("Repository still exist");
			res.send({msg:"Repository still exist"});			
		}//end else
	});//end fs.realpath
};//end post createRepository


/**************** increment les fichiers ****************/
var incFileNb=function(filename){
	var found = filename.match(/\((\d)\)\.txt/);
	if (found===null){
		newfile=filename.replace(".txt","(1).txt");
	} else {
		newNumber=parseInt(found[1])+1;
		newfile=filename.replace(/(\(\d\))\.txt/,"("+newNumber+").txt");
	}
	return newfile;
}// end function

var incFolderNb=function(filename){
	var found = filename.match(/\((\d)\)/);
	if (found===null){
		newfile=path.normalize(filename+"(1)");
	} else {
		newNumber=parseInt(found[1])+1;
		newfile=filename.replace(/(\(\d\))/,"("+newNumber+")");
	}
	return newfile;
}// end function



//////////////// exports /////////////////////
exports.sreadDirectory = sreadDirectory;
exports.scopypaste = scopypaste;
exports.scutpaste = scutpaste;
exports.scutOrCopy = scutOrCopy;
exports.sdelete = sdelete;
exports.saddFile = saddFile;
exports.saddFolder = saddFolder;
exports.screateRepository = screateRepository;