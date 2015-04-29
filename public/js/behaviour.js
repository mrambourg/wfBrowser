

/************** BROWSE DIRECTORY *****************/
$(document).on('click','.js-click_showDirectory',function(objEvent){
	$("#directoryLayer").slideToggle();
	setLocal('currentDir','');
	con_readDirectory('');
}); //end show directory

// behavior of ShowDirectory
$(document).on('click','.js-click_btgoHome',function(objEvent){
	setLocal('currentDir','');
	con_readDirectory('');
}); //end show directory

// browse throw directory
$(document).on('click','.js-click_Directory',function(objEvent){
	setLocal('currentDir',this.id);
	con_readDirectory(this.id);
});

/************** ADD ELEMENT *****************/
// add folder
$(document).on('click','.js-click_btaddFolder',function(objEvent){
	con_addFolder(getLocal("currentDir"),"RepertoireVide");
	});

//add file
$(document).on('click','.js-click_btaddFile',function(objEvent){
	con_addFile(getLocal("currentDir"),"FichierVide.txt");
	});

	
/************** CHANGE STYLE  *****************/	
$(document).on('click','.js-click_btchgStyle',function(objEvent){changeStyle();}); //end show directory			


/************** CONTEXT FILE MENU **********************/
$.contextMenu({
        selector: '.context-menu-one', 
        callback: function(key, options) {
		contextMenuOneDispatcher(key,$(this).attr('id'));
	},
        items: {
            "edit": {name: "Edit", icon: "edit"},
            "cut": {name: "Cut", icon: "cut"},
            "copy": {name: "Copy", icon: "copy"},
            "rename": {name: "Rename", icon: "rename"},
            "delete": {name: "Delete", icon: "delete"}

        }
    });

// switch to function
var contextMenuOneDispatcher=function(key,id){
	switch (key) {
		case "edit":
			alert('1 edit : '+id);
			break;
		case "cut":
			cutElement(id);          
			break;
          	case "copy":
			copyElement(id);          
			break;
        	case "rename":
			changeName('Changer le nom',id);
			break;
            	case "delete":
			con_delete(id);
			break;
        	default:
			alert('You have a strange mouse');
	} 
}//end function


/************** CONTEXT MAIN FOLDER MENU **********************/
$.contextMenu({
        selector: '.context-menu-mainFolder', 
        callback: function(key, options) {
		contextMenuMainFolderDispatcher(key,$(this).attr('id'));
        },
        items: {
            "createFile": {name: "create File", icon: "edit"},
            "createFolder": {name: "create Folder", icon: "paste"},
            "paste": {name: "Paste", icon: "paste"}
        }
    });
    
var contextMenuMainFolderDispatcher=function(key,id){
	switch (key) {
		case "createFile":
			con_addFile(getLocal("currentDir"),"FichierVide.txt");
			break;
	
		case "createFolder":
			con_addFolder(getLocal("currentDir"),"RepertoireVide");
			break;
          
		case "paste":
			con_paste(getLocal("pasteElement"),getLocal("currentDir"),getLocal("pasteType"));
			break;
      
		default:
			alert('You have a strange mouse '+key);
	} 
    }//end function
    

/************** DRAG AND DROP **********************/
var dragstop=function( event, ui ) {
	con_readDirectory(getLocal('currentDir'));
}
    
var dropElement=function(event, ui){
	var draggableId = ui.draggable.attr("id");
	var droppableId = $(this).attr("id");
	con_moveFile(draggableId,droppableId,'cut',0);
}//end drop function
    
    
/************************************************************************/
//upload
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
