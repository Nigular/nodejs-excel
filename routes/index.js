var express = require('express');
var router = express.Router();
// 引入连接mongodb的公共模块
var mongedb = require("../database/mongo.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '<h1>Express</h1>',users:[{username:'jack'},{username:'tom'},{username:'yanlong'}] });
});

router.route("/login").get(function(req,res){
	res.render("login",{title:"用户登录"});  // 渲染login模板
}).post(function(req,res){
	//console.log(req.body.username+"/"+req.body.password);
	var user = {username:"admin",password:"123456"}
	// 如果用户名和密码一致
	if(req.body.username===user.username && req.body.password === user.password){
		req.session.user = user;  //登录成功，记录到session里
		//console.log(req.session.user);
		res.redirect("/home");	// 跳转到home路由
	}else {
	    req.session.error='用户名或密码不正确';
	    res.redirect("/login");		// 否则跳转到login路由
	}
	
});

router.get("/loginout",function(req,res){
	req.session.user = null;  //退出后，清空session里的值
	res.redirect("/");
});

router.route('/home').get(function(req, res) {
    authentication(req, res);	// 先验证是否存在session
    res.render('home', { title: 'Home' });
}).post(function(req,res){
		// req=>接收post过来的信息
		mongedb.db.collection("users",function(err,collection){
			// 插入post过来的数据
			var timestamp=new Date().getTime();
			collection.insert({
					email:req.body.email,
					account:req.body.account,
					apply:req.body.apply,
					remarks:req.body.remarks,
					insertTime:timestamp		// 保存插入时间
				},
				function(err,docs){
					//console.log(docs);
					//mongedb.db.close();
					res.redirect("/list");	// 跳转到list列表路由
				})
		});
});
 
function authentication(req, res) {		
    if (!req.session.user) {	// 如果之前session里没有储存过user或者session过期，则不通过判断，返回登陆页	
        return res.redirect('/login');
    }
}

module.exports = router;
