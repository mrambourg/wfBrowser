/************** BEHAVIOR *****************/
$(document).on('click','.js-click_showDirectory',function(objEvent){
	sessionStorage.setItem('currentDir','');
	$("#directoryLayer").slideToggle();
	readDirectory('');
}); //end show directory

// behavior of ShowDirectory
$(document).on('click','.js-click_btgoHome',function(objEvent){
	sessionStorage.setItem('currentDir','');
	readDirectory('');
}); //end show directory

// behavior of change style
$(document).on('click','.js-click_btchgStyle',function(objEvent){changeStyle();}); //end show directory			

// browse throw directory
$(document).on('click','.js-click_Directory',function(objEvent){
	//alert("repertoire "+this.id);
	sessionStorage.setItem('currentDir',this.id);
	readDirectory(this.id);
});

// add folder
$(document).on('click','.js-click_btaddFolder',function(objEvent){
	var cDir=sessionStorage.getItem("currentDir");	
	addFolder(cDir,"RepertoireVide");
	});

//add file
$(document).on('click','.js-click_btaddFile',function(objEvent){
	var cDir=sessionStorage.getItem("currentDir");
	console.log("cDir "+cDir);
	addFile(cDir,"FichierVide.txt");
	});
	

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

/************** CONTEXTMENU **********************/
//menu pour les fichiers
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
    
var contextMenuOneDispatcher=function(key,id){
	switch (key) {
		case "edit":
			alert('1 edit : '+id);
			break;
		case "cut":
			cutElm(id);          
			break;
          	case "copy":
			copyElm(id);          
			break;
        	case "rename":
			alert('1 rename : '+id);
			break;
            	case "delete":
			cdelete(id);
			break;
        	default:
			alert('You have a strange mouse');
	} 
}//end function


//menu pour le global
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
			var cDir=sessionStorage.getItem("currentDir");
			console.log("cDir "+cDir);
			addFile(cDir,"FichierVide.txt");
			break;
	
		case "createFolder":
			alert('mainFolder createFolder : '+id);     
			break;
          
		case "paste":
			var pasteElement=sessionStorage.getItem("pasteElement");
			var pasteType=sessionStorage.getItem("pasteType");
			var cDir=sessionStorage.getItem("currentDir");
			var mObj={element:pasteElement ,type: pasteType, force: false, dir:cDir};
			paste(mObj);
			break;
        
      
		default:
			alert('You have a strange mouse '+key);
	} 
    }//end function
    

// Drag and drop function
var dragstop=function( event, ui ) {
	var cDir=sessionStorage.getItem('currentDir');			
	readDirectory(cDir);
	}//end stop drag
    
var dropElement=function(event, ui){
	var draggableId = ui.draggable.attr("id");
	var droppableId = $(this).attr("id");
	moveFile({
		src: draggableId, 
		dir: droppableId,
		type: 'cut',
		force: 0
	});
	
}//end drop function
    
    //<li class="context-menu-item"><span>Foo bar</span></li><li class="context-menu-item context-menu-submenu"><span>Sub group 2</span><ul style="width: 121px; z-index: 2;" class="context-menu-list"><li class="context-menu-item"><span>alpha</span></li><li class="context-menu-item"><span>bravo</span></li><li class="context-menu-item"><span>charlie</span></li></ul></li><li class="context-menu-item"><span>delta</span></li>
