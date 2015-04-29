/************** changeStyle *****************/
var changeStyle=function(){
	if ($(".iconstyle32")[0]){
		// Do something if class exists
		console.log("iconstyle32 exist");
		$('.iconstyle32').removeClass('iconstyle32').addClass('iconstyle');
		$('.icontext32').removeClass('icontext32').addClass('icontext');	
	} else {
		// Do something if class does not exist
		console.log("iconstyle32 doesn't exist");	
		$('.iconstyle').removeClass('iconstyle').addClass('iconstyle32');
		$('.icontext').removeClass('icontext').addClass('icontext32');	
	}
}

/************** COPY, CUT, PASTE *****************/
var copyElement=function(element){
	setLocal("pasteElement",element);
	setLocal("pasteType","copy");
	}	


var cutElement=function(element){
	setLocal("pasteElement",element);
	setLocal("pasteType","cut");
	}

	
	
	
	
	
	
	
	
/************************************************************************/
/************** CHANGE NAME *****************/
var changeName=function(msg,value){
	var rep=dirname(value);
	var nomFichier=basename(value) 
	var newName = prompt(msg,nomFichier);
	
	var trg=rep+"/"+newName;
	console.log(value+'\n'+trg+'\n'+newName);
	var mObj={	src: value,
				dir: trg,
				type: 'cut', 
				force: false
			};
}






	/*var mObj={
		dir: dir,
		file:'',
		trgDir:'',
		trgFile:'',
		type:'',
		force:''
	};
	*/


var createRepository=function(){
	var mObj={};
	con_readDirectory(mObj);
}


/**** boite de dialogue ***************/
var confirmAlert=function(msg){
	if (confirm(msg)) { // Clic sur OK
		return 1;
	} else {
	       return 0;
	}//end if confirm
}//end function


	
	
	
	
var pasteAll=function(){
	var reqObj=[];	
	var currentDir=sessionStorage.getItem("currentDir");
	var cutString=sessionStorage.getItem("cutTab");
	var copyString=sessionStorage.getItem("copyTab");
	
	// send all cut element
	var cutTab=(cutString===null)?[]:cutString.split(',');
	for (i=0;i<cutTab.length;i++){
		var nObj={
			source:  cutTab[i],
			target: currentDir,
			type: "cut"
		}
		reqObj.push(nObj);
	}//end for
	
	//send all copy element
	var copyTab=(copyString===null)?[]:copyString.split(',');
	for (i=0;i<copyTab.length;i++){
		var nObj={
			source:  copyTab[i],
			target: currentDir,
			type: "copy"
		}
		reqObj.push(nObj);
	}//end for
	cpasteAll(reqObj)
	console.log(JSON.stringify(reqObj));
}//end paste Element


/*** copy and cut element *
var elementCopy=function(element,type){
	//element can't be on cut and copy table in same time
	//element can't be cut or copy twice
	// CUT : remove element if in table
	var cutString=sessionStorage.getItem("cutTab");
	var cutTab=(cutString===null)?[]:cutString.split(',');
	var indexCutTab=cutTab.indexOf(element);
	if (indexCutTab>-1){
		cutTab = _.reject(cutTab, function(elm){ return elm===element; });
	}
	// COPY : remove element if in table
	var copyString=sessionStorage.getItem("copyTab");
	var copyTab=(copyString===null)?[]:copyString.split(',');
	var indexCopyTab=copyTab.indexOf(element);	
	if (indexCopyTab>-1){
		copyTab = _.reject(copyTab, function(elm){ return elm===element; });
	}
	
	// Add element
	if (type==="cut"){
		cutTab.push(element);
	} else {
		copyTab.push(element);
	}
	
	cutString=cutTab.join(',');
	copyString=copyTab.join(',');
	
	//stock copy and cut list of element
	sessionStorage.setItem("cutTab",cutString);
	sessionStorage.setItem("copyTab",copyString);	
}**/