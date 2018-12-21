var MongoClient = require('mongodb').MongoClient;

function Db(){
  var url = "mongodb://localhost:27017/";

  this.go =  function(){
    MongoClient.connect(url, { useNewUrlParser: true },function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      dbase.collection("job").find({}).forEach(
        function(item){
          console.log(item);
          dbase.collection("job").update({_id:item._id},{$set:{averageSalary:(item.minSalary+item.maxSalary)/2}},true)
        }
      );
    });
  };
}

var _db = new Db();
_db.go();