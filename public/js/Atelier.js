/***********	GLOBAL FUNCTION 	*************/
/***********	FUNCTION ERROR	*************/
	// function to catch error 
	var mlog=function(err){
		console.log("Erreur "+JSON.stringify(err));
	};
	
/***********	FUNCTION RENDER	*************/	
	var render=function(templateName,targetLayer,mData){
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! test si tpl_readDirectory est defini
	// si pas on va chercher le template par ajax
	//si pas de template ajax, on prend le default template
	/*************** template drawing *****************/
		var data=mData;
	getTemplate(templateName,function(templateName){
		//var tpl=$('#'+templateName).html();
		//get template string
		var tpl=$('#'+templateName).html();
		// create template engine
		var pagefn = doT.template(tpl);
		// resultText=template + data
		var resultText = pagefn({farray: data});
		// draw result in targetLayer
		$('#'+targetLayer).html(resultText);		
	});
	};
	
var getTemplate=function(templateName, cb){
	var tpl=$('#'+templateName).html();
	if( typeof(tpl) == 'undefined' ){
		loadTemplate(templateName,function(templateName){
			cb(templateName);
		});//end loadTemplate
	} else {
		cb(templateName);
	}//end if
	
}

/***********	FUNCTION AJAX	*************/
	var myAjax=function (mUrl,mObject,cbSuccess,cbError,mType){
		/* define default value */
		if( typeof(cbSuccess) == 'undefined' )	{var cbSuccess=function(res){console.log("Success "+JSON.stringify(res))}};	
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
	};/*  end myAjax */

	
/***********	FUNCTION  LOAD TEMPLATE	*************/	
	var loadTemplate = function (name,cbSuccess){
		$.ajax({
      			url: 			"/loadTemplate",
      			type: 		"POST",
      			dataType: 	"HTML",
      			data: 		{name: name},
      			error: 		function(err)		{
				console.log("templateError "+JSON.stringify(err));
			},
      			success: 		function(strData)	{
				var insertTemplate='<script id='+name+' type=text/x-dot-template>';
				insertTemplate+=strData;
				insertTemplate+='</script>';
				$('#template').append(insertTemplate);
				cbSuccess(name);
			}
      		});/* end ajax */
	};//end loadTemplate



