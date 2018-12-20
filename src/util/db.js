var MongoClient = require('mongodb').MongoClient;

function Db(){
  var url = "mongodb://localhost:27017/";

  // 插入数据
  this.insert = function(data){
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("job").insert(data, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
      });
    });
  };

  // 清空数据
  this.empty = function(){
    console.log('清空数据');
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("job").remove({},function(err, res){
        if (err) throw err;
        console.log("文档清空成功");
        db.close();
      });
    });
  };

  // 只获取薪资最高的20条记录
  this.query = function(city, position, num, callback){
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("job").find({"city":city}).sort({"minSalary": -1}).limit(num).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        callback && callback(result);
        db.close();
      });
    });
  };
}


module.exports = Db;