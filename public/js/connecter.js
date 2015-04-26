// connecter

var createRepository=function(){myAjax('/createRepository',{}, draw_createRepository);}
var readDirectory=function(dir){myAjax("/readDirectory",{directory: dir},draw_readDirectory);}
var addFile=function(dir,defaultFileName){myAjax('/addFile',{dir: dir,defaultFileName: defaultFileName}, draw_addFile);}

var moveFile=function(mObj){
	myAjax('/move',mObj, function(msg){
			console.log(msg);
	});
}


var paste=function(mObj){
	myAjax('/paste',mObj, function(msg){
		console.log(msg);
		var currentDir=sessionStorage.getItem("currentDir");
		sessionStorage.setItem('copyTab','');
		sessionStorage.setItem('cutTab','');
		readDirectory(currentDir);
	});
}
	
var cdelete=function(file){
	myAjax('/delete',{file: file},function(msg){
		console.log("delete "+msg);
		var currentDir=sessionStorage.getItem("currentDir");
		readDirectory(currentDir);
	});
};

var flushTrash=function(id){
	myAjax('/flushTrash',{}, function(){
		console.log("flushTrash");
	});
};

var addFolder=function(dir,defaultFileName){
	console.log("addFolder");
	myAjax('/addFolder',{dir: dir,defaultFileName: defaultFileName}, draw_addFile);
}


// addFolder --> creer un repertoire
// renommer un fichier
//renommer un repertoire
// renommer en masse
// déplacer un fichier (drag and drop)
// déplacer un repertoire (drag and drop)
// uploader un fichier
// copier un element (fichier ou repertoire)
// coller un element (fichier ou repertoire)
// couper un element (fichier ou repertoire)
// downloader une liste de fichier et/ou de repertoire
// zipper un fichier (compresser)
// chiffrer un fichier ou repertoire

// Visualiser et modifier
// un fichier texte (txt, js, html, etc...)
// un fichier image
// un fichier Office ou OpenOffice
// un fichier video
//....