var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heart";

MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  var dbase = db.db("heart");
  var myobj = { name: "菜鸟教程", url: "www.runoob" };
  dbase.collection("site").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("文档插入成功");
    db.close();
  });
});