var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heart";
var xlsx = require('node-xlsx').default;
var xlsxName = './xlsx/all.xlsx';

MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  var dbase = db.db("lagou");
  //var myobj = { name: "菜鸟教程", url: "www.runoob" };
  var jobs = getXlsxData();
  dbase.collection("job").insertMany(jobs, function(err, res) {
    if (err) throw err;
    console.log("文档插入成功");
    db.close();
  });
});

function getXlsxData(){
  const workSheetsFromFile = xlsx.parse(xlsxName);
  var original = workSheetsFromFile[0].data;
  var rs = [];
  for(var i = 0; i<original.length; i++){
    var item = original[i];
    rs.push({
      "companyShortName":item[0],
      "companySize":item[1],
      "financeStage":item[2],
      "companyLabelList":item[3],
      "industryField":item[4],
      "positionName":item[5],
      "minSalary":item[6],
      "maxSalary":item[7],
      "positionAdvantage":item[8],
      "companyFullName":item[9],
      "workYear":item[10],
      "education":item[11],
      "district":item[12],
      "businessZones":item[13],
      "formatCreateTime":item[14],
      "city":"深圳"
    });
  }
  return rs;
}
