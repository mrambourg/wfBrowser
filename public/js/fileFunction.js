/***********	GLOBAL FUNCTION 	*************/
/***********	FUNCTION ERROR	*************/
	// function to catch error 
	var mlog=function(err){
		console.log("Erreur "+JSON.stringify(err));
	}
	
/***********	FUNCTION RENDER	*************/	
	var render=function(templateName,targetLayer,mData){
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! test si tpl_readDirectory est defini
	// si pas on va chercher le template par ajax
	//si pas de template ajax, on prend le default template
	/*************** template drawing *****************/
		//get template string
		var tpl_readDirectory=$('#'+templateName).text();
		// create template engine
		var pagefn = doT.template(tpl_readDirectory);
		// resultText=template + data
		var resultText = pagefn({farray: mData});
		// draw result in targetLayer
		$('#'+targetLayer).html(resultText);			
	}
	
/***********	FUNCTION AJAX	*************/
	var myAjax=function (mUrl,mObject,cbSuccess,cbError,mType){
		/* define default value */
		if( typeof(cbSuccess) == 'undefined' )	{var cbSuccess=	function(res){console.log("Success "+JSON.stringify(res))}};	
		if( typeof(cbError) == 'undefined' )	{var cbError=	function(err){mlog(err);}};			
		if( typeof(type) == 'undefined' )		{var mType=	"POST"};		
	/* function ajax de jquery*/
		$.ajax({
      			url: 			mUrl,
      			type: 		mType,
      			dataType: 	"JSON",
      			data: 		mObject,
      			error: 		function(err)		{cbError(err);},
      			success: 		function(strData)	{cbSuccess(strData);}
      		});/* end ajax */
	}/*  end myAjax *


/***********	FILE FUNCTION 	*************/
/***********  	FUNCTION  CREATE REPOSITORY	 *************/	
	var createRepository=function(ID){
		//create repository if did not exist
		myAjax('/createRepository',{id: ID}, function(){
			// set global information
			sessionStorage.setItem("currentDir","");
			sessionStorage.setItem("ID",ID);
		});//end myAjax
	}//end readDirectory	
	

/***********  	FUNCTION  READDIRECTORY	 *************/	
	var readDirectory=function(){
	// read a directory and render the result
		var dir= sessionStorage.getItem("currentDir");
		var mObj={
			id:sessionStorage.getItem("ID"),
			directory: dir
		};
		//console.log("localDir "+ sessionStorage.getItem("currentDir"));
		myAjax("/readDirectory",mObj,function(res){
			//render the result
			render('default_readDirectory','listFileLayer',res);
			//modifie path location
			$('#pathLayer').text(dir);
		});//end my ajax		
	}//end readDirectory

	
	
	
	
	
	
	
	
	
	
	
	
	
/***********	FUNCTION  LOAD TEMPLATE	*************/	
	var loadTemplate = function (name){
		console.log("loadTemplate");
		$.ajax({
			url: "/loadTemplate",
			type: "post",
			dataType: "html",
			data: {name: name},
			error: function(err)	{
				console.log("templateError "+err);
				// empty template
				eval("tpl_"+name+'=""');								
			},
			success: function(strData)	{
				strData=strData.replace(/(\r\n|\n|\r)/g,"");
				eval("tpl_"+name+'="'+strData+'"');
				console.log(tpl_readDirectory);					
			}
		});
	}//end loadTemplate
	
/***********	FUNCTION  LOAD ALL TEMPLATE	*************/	
	var loadAllTemplate=function(tplArray,cbSuccess){
		var pending=tplArray.length;
		var count=pending;
		for (i=0;i<pending;i++){
			(function(i) {
				var tplFile=tplArray[i];
				loadTemplate(tplFile);
				count--;
				if (count === 0) {
					cbSuccess();
				} //end if
			})(i);//end function (i)
		};//end for
	}//end loadAllTemplate
	





	
	

	