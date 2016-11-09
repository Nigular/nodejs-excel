var express = require('express');
var router = express.Router();
// 引入连接mongodb的公共模块
var mongedb = require("../database/mongo.js");

var xlsx = require('node-xlsx');

//把excel五位日期格式转成时间戳
function ToTimestamp(str){
	var startdate=new Date('1900/01/01').getTime();
	var a = (str-2)*24*3600*1000+startdate;
	return a;
}

function insertData(obj,res){
	var newdata = obj[0].data;	// excel数据
		var timestamp="";  // 插入时间
	
		var mydata = new Array();
		var reg = new RegExp("^[0-9]*$");	//验证excel五位数字的时间格式
		for(i in newdata){
			if(i==0){
				continue;	//跳过第一条
			}
			if(reg.test(newdata[i][4])){	//如果是5位数字
				var a=newdata[i][4];
				timestamp = ToTimestamp(a);
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
					console.log("插入完毕,用时");
					res.redirect("/users");		// 完成后跳转到users路由
				});		
			});
		});
}

// 路由里的东西必须写在router.get 或者post里，不然会马上执行
router.get('/', function(req, res, next) {
	//接收参数
  var filename=req.query.name;

	var obj = xlsx.parse('./public/files/'+filename);// 数据太大会导致超时失败
	
	try{
		insertData(obj,res);
	}catch(e){
		console.log(e);
	}
	
});

// 路由必备
module.exports = router;