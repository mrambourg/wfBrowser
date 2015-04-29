/***********	FILE FUNCTION 	*************/

/***********  	FUNCTION  SPLIT A PATH To ARRAY OBJECT	 *************/	
var splitPath=function(mpath){
	//split a path and return a array of object with path and name
	var mchemin=mpath.split('/');
	var tPath=[];
	var chemin='';
	for (i = 1; i < mchemin.length; i++) {
		chemin+='/'+mchemin[i];
		var nPath={
			path : chemin,
			name :mchemin[i]
		};
		tPath.push(nPath);
	}
	tPath.unshift({path: '/',name: 'home'});
	//console.log('mchemin'+JSON.stringify(tPath));
	return tPath;	
};


function basename(path) {
        return path.replace(/\\/g,'/').replace( /.*\//, '' );
}
     
function dirname(path) {
        return path.replace(/\\/g,'/').replace(/\/[^\/]*$/, '');;
}

