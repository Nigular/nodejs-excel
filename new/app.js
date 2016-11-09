var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//采用Session短期存储用户名和密码
var session = require("express-session");

// 路由分配
var routes = require('./routes/index');
var users = require('./routes/users');
var upload = require("./routes/upload");
var excel = require("./routes/excel");
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
// 让ejs模板文件使用扩展名为html的文件
app.engine("html",require("ejs").renderFile);
app.set("view engine","html");


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//路由分发语句前加入
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//session配置	  暂时没搞懂session跟mongodb的连接关系,先不保存到mongodb去
app.use(session({
    cookie: { maxAge: 600000 },		//设置maxAge是600000ms，即600s后session和相应的cookie失效过期
    secret: "test",		// 设置密钥
    resave:false,	//重新保存：强制会话保存即使是未修改的。(默认值ture)
    saveUninitialized:true		//强制保存未初始化的会话到存储器
}));

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) {
        res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// 路由控制：
app.use('/', routes);    //index可以直接访问
app.use('/users', users);	// 用户列表页	对应routes里的users.js
app.use('/login', routes);	// 登陆路由
app.use('/loginout', routes);		// 退出登陆后，返回到index页面
app.use('/home', routes);	//home需要登录才能访问
app.use('/upload', upload);	// 用户列表页 ,对应routes里的upload.js
app.use("/excel",excel); // excel数据处理模块

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(8100,function(){    console.log("Server Start!");});

module.exports = app;
