//  create new Repository	
var draw_createRepository=function(res){
	sessionStorage.setItem('currentDir','');
	}

// draw data from Directory	
var draw_readDirectory=function(res){
	render('readDirectory','listFileLayer',res);
	var cDir=sessionStorage.getItem('currentDir');
	sessionStorage.setItem('currentDir',cDir);
	//add drag and drop
	$(".iconstyle").draggable({stop: dragstop});
	$('.iconDirectory').droppable({drop: dropElement});//end droppable
	draw_pathLayer(cDir);
}//end draw_readDirectory


//draw new file
var draw_addFile=function(res){
	var cDir=sessionStorage.getItem('currentDir');
	readDirectory(cDir);
	}
	
var draw_pathLayer=function(mpath){
	$('#pathLayer').text(mpath);
	var myPath=splitPath(mpath);
}
