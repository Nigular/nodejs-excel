var express = require('express');                                                                                                                                                                                                                                           
var router = express.Router();
var multiparty = require('multiparty');
var util = require('util');
var path = require('path');
var fs = require('fs');

router.get('/:fileName', function(req, res, next) {
 // 实现文件下载 
 var fileName = req.params.fileName;
 var __dirname='public/upload/';
 var filePath = path.join(__dirname, fileName);
 var stats = fs.statSync(filePath);
 if(stats.isFile()){
  res.set({
   'Content-Type': 'application/octet-stream',
   'Content-Disposition': 'attachment; filename='+fileName,
   'Content-Length': stats.size
  });
  fs.createReadStream(filePath).pipe(res);
 } else {
  res.end(404);
 }
});

module.exports = router;