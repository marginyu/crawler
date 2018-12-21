var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  var dbase = db.db("lagou");
  const result  = await dbase.collection("job").find({"city":'深圳',"demand":{$exists: true},"averageSalary":{$gt: 15}}).sort({"minSalary": -1}).limit(10000).toArray();
  console.log('长度',result.length);
  const _rs = result.map(function(item){
    return item.demand;
  });
  const content = _rs.join('');
  //console.log(content);
  handle(content);
  db.close();
});

const filterWord = [
  '熟悉','经验','优先','负责','页面','1.','2.','3.','4.','5.','6.','7.','8.','9.','10.','10','前端','前端开发','能力','良好','了解','岗位职责',
  '熟练','相关','熟练掌握','以上学历','要求','职位','项目','开发','代码','精通','应用','技术','团队','掌握','理解'
];
function handle(content){
  const nodejieba = require("nodejieba");
  const fs=require('fs');
  nodejieba.load({
    userDict: './user.utf8',
  });
  const result = nodejieba.extract(content, 300);
  const _rs = result.filter((item)=>{
    return filterWord.indexOf(item.word) < 0
  });
  let temp = "";
  for(let i in _rs){
    temp += _rs[i].word + " " + Math.ceil(_rs[i].weight) + "\n";
  }
  fs.writeFile('./wordCloud.txt',temp,'utf-8', function (err) {
    if (err) {
      console.log(err);
    }
  });
  //console.log(_rs);
}