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
  this.empty = function(callback){
    console.log('清空数据');
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("job").remove({},function(err, res){
        if (err) throw err;
        console.log("文档清空成功");
        callback && callback();
        db.close();
      });
    });
  };

  // 只获取薪资最高的20条记录
  this.query = function(city, position, num, pageIndex, callback){
    console.log(num, pageIndex);
    MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      const result  = await dbase.collection("job").find({"city":city}).sort({"minSalary": -1}).skip(pageIndex*num).limit(num).toArray();
      const count = await dbase.collection("job").find({}).count();
      callback({
        result,
        count,
      });
      db.close();
    });
  };

  // 插入抓取记录
  this.addcrawlerRecord = function(data){
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("crawlerRecord").insert(data, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        db.close();
      });
    });
  };

  // 获取最新的抓取记录
  this.getNewestCrawlerRecord = function(callback){
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("crawlerRecord").find({}).sort({"_id": -1}).limit(1).toArray(function(err, result) {
        if (err) throw err;
        callback && callback(result);
        db.close();
      });
    });
  };

  // 获取统计信息
  this.getStatis = function(callback){
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("job").group(['averageSalary'], {minSalary: {$gt: 0}}, {"count":0}, "function (obj," +
        " prev) { prev.count++; }", function(err, results) {
        var rs = results.sort(sortSalary);
        console.log(rs);
        callback && callback(rs);
        db.close();
      });
    });
  };
}

function sortNumber(a,b) {
  return a.count - b.count
}

function sortSalary(a,b) {
  return a.averageSalary - b.averageSalary
}


module.exports = Db;