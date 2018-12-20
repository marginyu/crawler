var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/heart";
// nodejs mongodb驱动 API文档： http://mongodb.github.io/node-mongodb-native/2.0/api/index.html
//统计岗位总数，待遇梯度，排名前10的岗位详情
function getJobsByCity(city,callback) {
  var rs = {};
  MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
    if (err) throw err;
    console.log("数据库已创建!");
    var dbase = db.db("lagou");
    dbase.collection("job").find({"city": city}).count(function(err,res){
      //console.log(res);
      rs.num = res;
      dbase.collection("job").find({"city": city}).sort({"minSalary": -1}).limit(5).toArray(function(err,res){
        //console.log('>>>>', res);
        rs.goodJobs = res;
        dbase.collection("job").aggregate([
          {$match:{"city":city ,"minSalary":{$gte:20} }} ,
          {$group:{ _id: {minSalary:"$minSalary"}, count: {"$sum":1} }}
        ]).toArray(function(err,res){
          //console.log('>>>>', res);
          rs.salaryInfo = res;
          console.log('>>>>>最终结果出来了：', rs);
          callback && callback(rs);
          db.close();
        });
      });
    });
  });
}

// getJobsByCity("北京");

module.exports = getJobsByCity;