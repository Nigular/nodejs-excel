var express = require('express');                                                                                                                                                                                                                                           
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var fs = require('fs');

/* 上传页面 */
router.get('/', function(req, res, next) {
  res.render('upload', { title: '上传文件' });
});

/* 确定上传 */
router.post('/', function(req, res, next){
  //生成multiparty对象，并配置上传目标路径
var form = new multiparty.Form({uploadDir: './public/files/'});
//上传完成后处理
form.parse(req, function(err, fields, files) {
    var filesTmp = JSON.stringify(files,null,2);

    if(err){
      console.log('parse error: ' + err);
    } else {
      console.log('parse files: ' + filesTmp);
      var inputFile = files.inputFile[0];
      var uploadedPath = inputFile.path;
      var dstPath = './public/files/' + inputFile.originalFilename;
      //重命名为真实文件名,不然它会用一种特别的命名
      fs.rename(uploadedPath, dstPath, function(err) {
        if(err){
          console.log('rename error: ' + err);
        } else {
          console.log('rename ok');
          res.redirect("/excel?name="+inputFile.originalFilename);	// 跳到excel.js去处理数据库录入
        }
      });
    }
		
//  res.writeHead(200, {'content-type': 'text/plain;charset=utf-8'});
//  res.write('received upload:\n\n');
//  res.end(util.inspect({fields: fields, files: filesTmp}));
   });
});

/** 下载excel **/
router.post('/download', function(req, res, next) {
  write.write();
});


module.exports = router;