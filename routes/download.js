var express = require('express');                                                                                                                                                                                                                                           
var router = express.Router();
var multiparty = require('multiparty');
var write = require('./write.js');
// 引入连接mongodb的公共模块
var mongedb = require("../database/mongo.js");

/* 展示页面 */
router.get('/', function(req, res, next) {
  res.render('download', { title: '上传下载' });
});

/*下载方法*/
router.post('/', function(req, res, next) {
	// 查找数据
	mongedb.db.collection("users", function(err, collection) {
		if(err) throw err;
		else {
			collection.find({}).toArray(function(err, docs) {
				if(err) {
					throw err;
				} else {
					listSize = docs.length;
					console.log(listSize);
					write.write(docs,res);
				}
			})
		}
	});
});

module.exports = router;