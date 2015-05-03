var fs = require('fs');
var fse= require("fs.extra");
var path = require('path');
var _ = require("underscore");
var ncp = require('ncp').ncp;
var formidable = require('formidable'); //upload

var lg=require('./log.js');
var fInfo=require('./fileLibrary.js');

/**************** READ DIRECTORY ****************/
var ser_readDirectory=function (res,sObj,cb){
	var currentdir=sObj.dir;
	var homedir=sObj.homedir;
	var currentdir=fi_readDirectory(homedir,currentdir);
	
	/* walk throw the directory */
	fInfo.walk(currentdir,1,function(err, results){
		if (err){lg.logError(err)};
		var mesRes=[];
		// defined parent directory
		var pDir=path.normalize( currentdir + '/..' );
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
			cb(res,mesRes);
		} else {
			//si le repertoire n'est pas vide, on recupere les infos
			fInfo.fileinfo(results,function(err,mesResultats){
				mesRes=_.union(mesRes,mesResultats);
				mesRes=fo_readDirectory(mesRes,homedir);
				cb(res,mesRes);				
			});
		} // fin de si repertoire vide - retourne les donnees	
	}) ; //fin de walk
};//end function

/* filter in function of sreadDirectory */
function fi_readDirectory(homedir,currentdir){
	//split path
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



/**************** DELETE ****************/
var ser_delete=function(res,sObj,cb){
	/*
	sObj={trg: trg	//trash Directory};
	*/
	var trg=sObj.trg;
	fse.rmrf(trg, function (err) {
		if (err) {console.error(err);}
		cb(res,{msg:"Empty Trash"});	
	});
};


/**************** CREATE Repository ****************/
var ser_createRepository=function (res,sObj,cb){
	/*
	mObj={};
	*/
	var id=sObj.id;
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
					cb(res,{msg:"Repository created"+id});
				});//end ncp
			});//end fs.mkdir
		} else {
			console.log("Repository still exist");
			cb(res,{msg:"Repository still exist"});			
		}//end else
	});//end fs.realpath
};//end post createRepository


/**************** ADD FILE ****************/
var ser_addFile=function (res,sObj,cb){
	// test if default file exist or not
	/*
	sObj={file: destination 	//user id}
	*/
	fs.stat(sObj.file, function(err, stat) {
		if(err == null) {
			//recursive call if file name existe
			//var newFilename=incFileNb(file);
			sObj.file=incFileNb(sObj.file);
			ser_addFile(res,sObj,cb);
		} else if(err.code == 'ENOENT') {
			// create new file
			fs.writeFile(sObj.file, "", function(){
				cb(res,{msg:"ENOENT "+sObj.file})
			});
		} else {
			cb(res,{msg:'Some other error: '+ err.code});
		}//end if
	});//end stats
}

/**************** ADD FOLDER ****************/
var ser_addFolder=function (res,sObj,cb){
	// test if default file exist or not
	/*
	sObj={file: destination 	//user id}
	*/
	fs.stat(sObj.file, function(err, stat) {
		if(err == null) {
			//recursive call if file name existe
			sObj.file=incFolderNb(sObj.file);
			ser_addFolder(res,sObj,cb);
		} else if(err.code == 'ENOENT') {
			// create new file
			fs.mkdir(sObj.file, function(){
				cb(res,{msg:"ENOENT "+sObj.file})
			});
		} else {
			cb(res,{msg:'Some other error: '+ err.code});
		}//end if
	});//end stats
}


/**************** MOVE FILE ****************/
var ser_moveFile=function (res,sObj,cb){
	/*
	var sObj={
		src:	src,
		trg:	trg,
		type: type,
		force: force
	}	
	*/
	//test si fichier cible existe
	fs.stat(sObj.trg, function(err, stat) {
		if(err == null) {
			//file exist
			if (sObj.force==1){
				console.log("ecrase le fichier");
				//on efface le fichier arrivé
				ser_delete(res,sObj,function(){
					// on force la copie
					ser_cutOrCopy(res,sObj,function(res,msg){
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
			sObj.type='cut';
			ser_cutOrCopy(res,sObj,function(res,msg){
			//wb.scutOrCopy(res,src,trg,'cut',function(res,msg){
				console.log(msg);
				res.json(msg);			
			});
		} else {
			//error file path 
			res.json({msg : 'error exist'});				
		}//if err
	});//if stat
}

/**************** COPY, CUT AND PASTE ****************/
var ser_cutOrCopy=function(res,sObj,cb){
	console.log("scutOrCopy"+JSON.stringify(sObj));
	/*
	sObj={	file: file, 	//source file
			trg: trg	//target file};
	*/
	var type=sObj.type;
	if (type==="cut"){
		console.log("scutpaste");		
		ser_cutpaste(res,sObj,function(res,msg){cb(res,msg);});
	} else {
		console.log("scopypaste");				
		ser_copypaste(res,sObj,function(res,msg){cb(res,msg);});
	}
};


var ser_cutpaste=function(res,sObj,cb){
	/*
	sObj={	src: src, 	//source file
			trg: trg	//target file};
	*/
	fs.stat(sObj.trg, function(err, stat) {
		if(err == null) {
			cb(res,{msg : "Error file exist"});	
		} else {
			fse.move(sObj.src,sObj.trg, function (err) {
				if (err) {throw err;}
				cb(res,{msg : "Moved files"});
			});//end fse.move
		}//end if
	});//end fs.stat
};//end scutpaste


var ser_copypaste=function(res,sObj,cb){
	/*
	sObj={	src: src, 	//source file
			trg: trg	//target file};
	*/
	var file=sObj.src;	
	var trg=sObj.trg;

	console.log("ser_copypaste"+JSON.stringify(sObj));
	fs.stat(trg, function(err, stat) {
	console.log("fstab");		
		if(err == null) {
			cb(res,{msg : "Error file exist"});	
		} else {
			fse.copy(file,trg, {replace: true},function (err) {
				if (err) {
					console.log(err);
					throw err
					};
				cb(res,{msg : "Copied files"});
			});//end fse.copy
		}//end if
	});//end fs.stat
};//end scutpaste


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
exports.ser_readDirectory = ser_readDirectory;
exports.ser_moveFile=ser_moveFile;
exports.ser_cutOrCopy = ser_cutOrCopy;
exports.ser_cutpaste = ser_cutpaste;
exports.ser_copypaste = ser_copypaste;

exports.ser_delete = ser_delete;
exports.ser_createRepository = ser_createRepository;
exports.ser_addFile=ser_addFile;
exports.ser_addFolder=ser_addFolder;

