/************** Connecter *****************/

/************** CREATE REPOSITORY ************/
var con_createRepository=function(){
	var mObj={};
	myAjax('/createRepository',mObj, draw_createRepository);
	}
	
/************** FLUSH TRASH *****************/
var con_flushTrash=function(){
	var mObj={};
	myAjax('/flushTrash',mObj, function(){
		console.log("flushTrash");
	});
};

/************** BROWSE DIRECTORY ************/
var con_readDirectory=function(dir){
	var mObj={
		dir: dir 	// directory to walk	
	};
	myAjax("/readDirectory",mObj,draw_readDirectory);
}
	
	
/************** ADD ELEMENT *****************/
var con_addFolder=function(dir,filename){
	var mObj={
		dir: dir,			//where to create folder
		filename: filename	//name for new folder
	};
	myAjax('/addFolder',mObj, draw_currentDir);
}
	
var con_addFile=function(dir,filename){
	var mObj={
		dir: dir,			//where to create file
		filename: filename	//name for new file	
	};
	myAjax('/addFile',mObj,draw_currentDir);
}

/************** DELETE ELEMENT *****************/
var con_delete=function(filename){
	var mObj={
		filename: filename	// full file name to delete	
	};
	myAjax('/delete',mObj,draw_currentDir);
};


/************** PASTE ELEMENT *****************/
var con_paste=function(filename,dir,type){
		var mObj={
			filename:	filename ,	//filename to paste
			dir:		dir,		//where
			type: 	type, 	//cut or copy
			force: 	0		//overwrite or not
			};
	
	setLocal('copyTab','');
	setLocal('cutTab','');
	con_moveFile(filename,dir,type,0);
}


/************** MOVE ELEMENT *****************/
var con_moveFile=function(filename,dir,type,force){
	var mObj={
		filename:	filename ,	//filename to paste
		dir:		dir,		//where
		type: 	type, 	//cut or copy
		force: 	force	//overwrite or not
	}
	
	myAjax('/move',mObj, function(msg){
		var msgEcrase='Voulez vous ecraser le fichier ?';
		if (msg.msg==='File Exist'){
			if (confirmAlert(msgEcrase)){
				con_moveFile(mObj.filename,mObj.dir,mObj.type,1);
			}
		} else {
			draw_currentDir({});
		}//end if
	});//end myAjax
}//moveFile






/************************************************************************/
var rename=function(mObj){
	myAjax('/rename',mObj, function(msg){
			console.log(msg);
	});
}


var fileExist=function(mObj){
	myAjax('/fileExist',mObj, function(msg){
			console.log(msg);
	});
}
	






// renommer un fichier
//renommer un repertoire
// renommer en masse
// uploader un fichier
// downloader une liste de fichier et/ou de repertoire
// zipper un fichier (compresser)
// chiffrer un fichier ou repertoire

// Visualiser et modifier
// un fichier texte (txt, js, html, etc...)
// un fichier image
// un fichier Office ou OpenOffice
// un fichier video
//....