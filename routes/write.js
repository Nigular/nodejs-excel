var excelPort = require('excel-export');
var fs = require('fs');

//把时间戳转为5位excel日期
function ToExcelDate(str){
	var startdate=new Date('1900/01/01').getTime();
	var nowdate = str;
	return parseInt((nowdate-startdate)/1000/3600/24+2);
}
	
exports.write = function(req, res, next){
    var datas = req;
    
    var conf = {};
    var filename = 'filename';  //只支持字母和数字命名
	
    conf.cols = [
       {caption:'邮箱', type:'string', width:60},
       {caption:'账号', type:'string', width:40},
       {caption:'是否申请', type:'string', width:20},
       {caption:'备注', type:'string', width:40},
       {caption:'时间', type:'date', width:30}
    ];

    var array = [];
    for(var i=0;i<datas.length;i++){
    	array[i] = [
	    	datas[i].email,
	    	datas[i].account,
	    	datas[i].apply,
	    	datas[i].remarks,
	    	ToExcelDate(datas[i].inserttime)
	    ];
    }

    conf.rows = array;
    var result = excelPort.execute(conf);

    var random = Math.floor(Math.random()*10000+0);

    var uploadDir = 'public/upload/';
    var filePath = uploadDir + filename + random + ".xlsx";
    
    //'binary'是二进制数据的意思
    fs.writeFile(filePath, result, 'binary',function(err){
        if(err){
            console.log(err);
        }else{
        	console.log(filePath);
        	res.redirect("/file/"+filename + random + ".xlsx");
        }
    });
}

