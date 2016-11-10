var express = require('express');
var router = express.Router();
// 引入连接mongodb的公共模块
var mongedb = require("../database/mongo.js");

// 翻页的变量
var pageSize=20;
var nowPage=0;
var listSize=0;

/* GET users listing. */
router.route('/').get(function(req, res, next) {
  //处理传过来的翻页参数
  if(req.query.topage){
  		nowPage=req.query.topage-1;
  		if(nowPage<0){
  			nowPage=0;	// 限制不小于0
  		}
  }
  
  // 查找数据
		mongedb.db.collection("users",function(err,collection){
			if(err) throw err;
			else{
				// 删除所有数据
//				collection.remove({}, function(err, result) {
//			    if(err) throw err;
//			    else{
//			    	console.log("成功删除所有数据!");
//			    }
//			  });
					collection.find({}).toArray(function(err,docs){
						if(err){ 
							throw err;
						}else{
								listSize = docs.length;
								console.log(listSize);
								// 翻页条件查找
								collection.find({},{limit:pageSize,skip:nowPage*pageSize}).toArray(function(err,docs){
									if(err){ 
										throw err;
									}else{
										//console.log(docs.length);
										res.render("list",{ title: '列表页',totalPage:listSize/pageSize,nowPage:(nowPage+1),data:docs});  // 渲染login模板
										//mongedb.db.close();
									}
								})
						}
					}) 
				}
		}); 
}).post(function(req,res){
	var whereStr;
	var limit = req.body.searchkey;	
	if(limit.length==0){
		whereStr={};
		res.redirect("/list");	// 重新跳回去list的get页面
	}else{
		whereStr = {"email":limit};
	}
	// 查找指定的数据
		// 查找数据
		mongedb.db.collection("users",function(err,collection){
			if(err) throw err;
			else{
			  // 查找所有数据
				collection.find(whereStr).toArray(function(err,docs){
					if(err) throw err;
					else{ 
						
						res.render("oneuser",{ title: '搜索结果',data:docs});  // 渲染login模板
					}
				})
			}
		}); 
});


module.exports = router;
