var mongo = require("mongodb");
var host = "localhost";
var port = 27017;
var server = new mongo.Server(host,port,{auto_reconnect:true});
var db = new mongo.Db("node-mongo-examples",server,{safe:true});
db.open(function(err,db){
	if(err) throw err;
	else{
		console.log("成功建立数据库连接");
	}
});

db.on("close",function(err,db){
	if(err) throw err;
	else{
		console.log("成功关闭数据库");
	}
})

exports.db = db;// 作为一个模块被引用，要用exports把变量暴露出去