var MongoClient = require('mongodb').MongoClient;

function Db(){
  var url = "mongodb://10.2.40.110:27017/";

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

  // 获取岗位列表
  this.query = function(params, callback){
    let {size, field, district, realFlag, focusFlag, financeStage, sort, pageIndex} = params;
    const num  = 10;
    pageIndex = pageIndex - 1 ;
    let _params = {"city":'深圳'};
    if(size != 'all'){
      _params.companySize = size;
    }
    if(field != 'all'){
      _params.industryField = new RegExp(field, 'i');
    }
    if(financeStage != 'all'){
      _params.financeStage = financeStage;
    }
    if(district != 'all'){
      _params.district = district;
    }
    if(realFlag != 'all'){
      _params.flag = (realFlag == 1)?0:-1;
    }
    if(focusFlag != 'all'){
      _params.attention = (focusFlag == 1)?1:0;
    }

    let sortColumn = 'averageSalary';
    if(sort == 1){
      sortColumn = 'maxSalary';
    }else if(sort == 2){
      sortColumn = 'minSalary';
    }

    console.log('查询参数',_params);
    MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      //const result  = await dbase.collection("job").find({"city":city, "flag": 0}).sort({"minSalary":-1}).skip(pageIndex*num).limit(num).toArray();
      // https://mongodb.github.io/node-mongodb-native/api-generated/collection.html#find
      const result  = await dbase.collection("job").find(_params, {sort:[[sortColumn,-1]]}).skip(pageIndex*num).limit(num).toArray();
      const count = await dbase.collection("job").find(_params).count();
      let condition = {
        districtOptions:[],
        fieldOptions:[],
        financeOptions:[],
        sizeOptions:[]
      };
      if(pageIndex == 0){
        const districtOptions = await dbase.collection("job").distinct('district');
        const fieldOptions = await dbase.collection("job").distinct('industryField');
        const financeOptions = await dbase.collection("job").distinct('financeStage');
        const sizeOptions = await dbase.collection("job").distinct('companySize');
        condition = {
            districtOptions,
            fieldOptions,
            financeOptions,
            sizeOptions
        }
      }
      callback({
        result,
        count,
        condition
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
      dbase.collection("job").group(['averageSalary'], {flag: 0, minSalary: {$gt: 0}}, {"count":0}, "function (obj," +
        " prev) { prev.count++; }", function(err, results) {
        var rs = results.sort(sortSalary);
        //console.log(rs);
        callback && callback(rs);
        db.close();
      });
    });
  };

  // 关注
  // attendtion：1，关注；0，未关注
  this.focus = function(params, callback){
    const positionId = parseInt(params.id);
    const attention = params.flag ? 1: 0;
    MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      var dbase = db.db("lagou");
      await dbase.collection("job").update({positionId:positionId},{$set:{attention:attention}},true);
      callback && callback(200);
      db.close();
    });
  };

  // 删除
  // flag: -1, 已删除；0，未删除
  this.del = function(params, callback){
    const id = params.id;
    const flag = params.flag ? -1: 0;
    MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
      if (err) throw err;
      console.log("数据库已创建!");
      console.log(id, flag);
      var dbase = db.db("lagou");
      await dbase.collection("job").update({companyId:id},{$set:{flag: flag}},{multi:true, upsert:true});
      callback && callback(200);
      db.close();
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
