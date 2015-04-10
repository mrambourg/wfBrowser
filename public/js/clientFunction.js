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