var moment = require("moment");
var fs = require("fs");


/******************** LOG FUNCTION **************/
//get information from request 
 var logfunction=function(req){
	// when connection done 
		var when=moment().format('HH:mm:ss');
	//what ip address 
		var ipadd=req.connection.remoteAddress;
	//what function have been call 
		var fcall=arguments.callee.caller.name;
	//what data where send 
		var body=JSON.stringify(req.body);
	//log format 
		var tmpStr=when+";"+ipadd+";"+fcall+";"+body+"\n";
	//write data in log file 
		writeLog("logFile",tmpStr);
}

//write log information into file 
var writeLog=function(mtype,mstring){
	//log file name define by mtype
		var mfile=__dirname+"/server/log/"+moment().format('YYYY_MM_DD')+"_"+mtype+".txt";
	//test mstring against hack 
		mstring = mstring.toString().replace(/\r\n|\r/g, '\n'); // hack
	//write mstring in log mtype file locate in /server/log 
	//	fs.appendFile(mfile, mstring, function(err) {if(err) {console.log(err);}}); 
}


//standard log function
var log=function (msg){
	// when event done 	
		var when=moment().format('HH:mm:ss');
	// what function have been call 
		var fcall=arguments.callee.caller.name;
	// log format 
		var tmpStr=when+";"+fcall+";"+msg+"\n";
	// send info into console.log
		//~ console.log(tmpStr);
	// send info into debugFile comment if you don't want to write it 
		//~ writeLog("debugFile",tmpStr);
}



// Gestion des erreurs 
var errorFunction=function(res,req,callerFunction){
	var s=JSON.stringify(req.body)
	s = s.toString().replace(/\r\n|\r/g, '\n'); // hack
	s="\n"+moment().format('HH:mm:ss')+" = "+callerFunction+"\n\t"+s;
	writeLog("function",s);
	// return error message //
	res.send(404);	
}

// Gestion des erreurs 
var errorTemplate=function(res,msg){
	var s="\n"+moment().format('HH:mm:ss')+"\n\t"+msg;
	writeLog("template",s);
	// on retourne un message erreur
	res.send(404);	
}


var logError=function(err){
	console.log("logError"+err);	
	writeLog("error",err);
}

//////////////// exports /////////////////////
exports.errorFunction = errorFunction;
exports.log = log;
exports.errorTemplate = errorTemplate;
exports.logError = logError;
exports.logfunction = logfunction;
