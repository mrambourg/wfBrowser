/************** BEHAVIOR *****************/
$(document).on('click','.js-click_showDirectory',function(objEvent){
	sessionStorage.setItem('currentDir','');
	$("#directoryLayer").slideToggle();
	readDirectory();
}); //end show directory

// behavior of ShowDirectory
$(document).on('click','.js-click_btgoHome',function(objEvent){
	sessionStorage.setItem('currentDir','');
	readDirectory();
}); //end show directory

// behavior of change style
$(document).on('click','.js-click_btchgStyle',function(objEvent){changeStyle();}); //end show directory			

// browse throw directory
$(document).on('click','.js-click_Directory',function(objEvent){
	sessionStorage.setItem('currentDir',this.id);
	readDirectory();
});

// show UpLoad laye
$(document).on('click','.js-click_btshowUpLoad',function(objEvent){$("#upLoadLayer").slideToggle();});





$(document).on('submit','#uploadForm',function(objEvent){
	objEvent.preventDefault(); // J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire
	var mObj={
		id: sessionStorage.getItem('ID'),
		dir: sessionStorage.getItem('currentDir'),
		file: $('#mfile').val()
		}
	myAjax('/upload',mObj, function(res){
		console.log("uploadform "+JSON.stringify(res));
	});
	/*mfile=$('#mfile').val();
	mID=sessionStorage.getItem('ID');
	mCurrentDir=sessionStorage.getItem('currentDir');
	var $this = $(this);
	*/
});



