var express = require('express');
var router = express.Router();
// 引入连接mongodb的公共模块
var mongedb = require("../database/mongo.js");

var xlsx = require('node-xlsx');


// 路由里的东西必须写在router.get 或者post里，不然会马上执行
router.get('/', function(req, res, next) {
	//接收参数
  var filename=req.query.name;
  console.log(filename);

	var obj = xlsx.parse('./public/files/'+filename);
	var newdata = obj[0].data;	// excel数据
	var timestamp=new Date().getTime();  // 插入时间

	var mydata = new Array();
	for(i in newdata){
		if(i==0){
			continue;	//跳过第一条
		}

		mydata.push({
			email:newdata[i][0],
			account:newdata[i][1],
			apply:newdata[i][2],
			remarks:newdata[i][3],
			inserttime:timestamp
		});
	}	
	//console.log(mydata);
	var endtime = new Date().getTime();  // 结束时间
	
    mongedb.db.open(function(err,db){
		mongedb.db.collection("users",function(err,collection){
			collection.insert(mydata,function(err,docs){
				if(err) throw err;
				else
				console.log("插入完毕,用时"+(endtime-timestamp)+"ms");
				res.redirect("/users");		// 完成后跳转到users路由
			});		
		});
	});
  
});


// 路由必备
module.exports = router;