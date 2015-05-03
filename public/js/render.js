//  create new Repository	
var draw_createRepository=function(res){
	setLocal('currentDir','');
	}

// draw data from Directory	
var draw_readDirectory=function(res){
	render('readDirectory','listFileLayer',res);
	//add drag and drop
	$(".iconstyle").draggable({stop: dragstop});
	$('.iconDirectory').droppable({drop: dropElement});//end droppable
	draw_pathLayer(getLocal('currentDir'));
}//end draw_readDirectory


//draw new file
var draw_currentDir=function(res){
	con_readDirectory(getLocal('currentDir'));
}
	

var draw_pathLayer=function(mpath){
	$('#pathLayer').text(mpath);
	var myPath=splitPath(mpath);
}
