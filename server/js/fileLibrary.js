var fs = require("fs");
var path=require("path");
var _ = require('underscore');

///////////////////////////// walk throw filesystem ////////////////////////
var walk = function(dir,level, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
  		  if (err) return done(err);
  		  var pending = list.length;
  		  if (!pending) return done(null, results);
  		 list.forEach(function(file) {
  		  	//on nettoie le chemin
  		  	file=path.normalize( dir + '/' + file);
  		  	fs.stat(file, function(err, stat) {
  		  		if (stat && stat.isDirectory()) {
  		  			results.push(file);
  		  			// si on a mis la fonction de recursivité
  		  			if (level>1){
  		  				walk(file, level-1,function(err, res) {
  		  					results = results.concat(res);
  		  					if (!--pending) done(null, results);
  		  				});
  		  			} else {
  	 		  			if (!--pending) done(null, results);	  			
  		  			}
  		  		} else {
  		  			results.push(file);
  		  			if (!--pending) done(null, results);
  		  		}//end if
  		  	});//end filestat
  		  });//end foreachs
  	});//end fsread
};//end walk


// get info from a file or a list of file
 var fileinfo=function(listfile,done){
    	var mesResultats=[];
	var pending=listfile.length;
 	var count=pending;
 	   	for (i=0;i<pending;i++){
 			(function(i) {
 				var file=listfile[i];
 				fs.stat(file, function(err, stat) {
 					if(err) done(err);
 					//on nettoie le chemin
 						file=path.normalize(file);
 					// file type
 						if (stat.isFile()) {type="File"}
 						else if (stat.isDirectory()) {type="Directory"}
 						else if (stat.isBlockDevice()) {type="BlockDevice"}
 						else if (stat.isCharacterDevice()) {type="CharacterDevice"}
 						else if (stat.isSymbolicLink()) {type="SymbolicLink"}
 						else if (stat.isFIFO()) {type="FIFO"}
 						else if (stat.isSocket()) {type="Socket"}
 						else {type="error"}
 					// basename
 						var basename=path.basename(file);
 					//dirname
 						var dirname=path.dirname(file);
 					//filename
 						var filename=file;
 					//extension
 						//var extension=path.extname(file).replace(".","");
						var extension=(type==="Directory")?"Directory":path.extname(file).replace(".","");
 					// size
 						var size= stat.size;
 					// info additionnel
 						var more={
 							filename: filename,
 							dirname:  dirname,
 							basename: basename,
 							extension: extension,
 							type:     type,
 							size:     size
 						};//end more
 						var myObj=_.defaults(more,stat);
 					//on enleve les infos non necessaires
 						//myObj=_.omit(myObj, 'isDirectory','isFile','isBlockDevice','isCharacterDevice','isSymbolicLink','isFIFO','isSocket','_checkModeProperty');
 						mesResultats.push(myObj);	
 						count--;
 						if (count === 0) {
 							done(err,mesResultats);
 						} //end if
 				});//end fs.stat
    			})(i);//end function (i)
    		};//end for 				
    }//end function



//////////////// exports /////////////////////
exports.walk = walk;
exports.fileinfo = fileinfo;
