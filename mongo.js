var mongo = require("mongodb");
var host = "localhost";
var port = 27017;
var server = new mongo.Server(host,port,{auto_reconnect:true});
var db = new mongo.Db("node-mongo-examples",server,{safe:true});
db.open(function(err,db){
	if(err) throw err;
	else{
		console.log("成功建立数据库连接");
		// 插入数据
		/*db.collection("users",function(err,collection){
			collection.insert({username:"kerry",age:22},
				function(err,docs){
					console.log(docs);
					db.close();
				})
		});*/
		// 查找数据
		/*db.collection("users",function(err,collection){
			if(err) throw err;
			else{
				collection.find({}).toArray(function(err,docs){
					if(err) throw err;
					else{
						console.log(docs);
						db.close();
					}
				})
			}
		}); */
		// 删除所有数据
		/*db.collection("users",function(err,collection){
			if(err) throw err;
			else{
				  db.collection.remove({}, function(err, result) {
				    if(err) throw err;
				    else{
				    	console.log("成功删除所有数据!");
				    }
				})
			}
		}); */
		// 修改数据库
	  	var whereStr = {"name":'wilson001'};
	  	var updateStr = {$set: { "age" : 100 }};
	  	collection.update(whereStr,updateStr, function(err, result) {
	    	if(err) throw err;
			else{
				console.log(result);
				db.close();
			}
	 	});
	}
});

db.on("close",function(err,db){
	if(err) throw err;
	else{
		console.log("成功关闭数据库");
	}
})