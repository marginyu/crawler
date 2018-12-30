var express = require('express');
var bodyParser = require('body-parser');//解析,用req.body获取post参数

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// 允许所有的请求形式
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


var position = require('./service/position');

app.get('/', function (req, res) {
  console.log("主页 GET 请求");
  res.send('Hello world');
})

app.post('/getPositionList', function (req, res) {
  console.log("获取岗位列表", req.body);
  const params = req.body;
  position.get(params,res);
  //res.send('岗位列表信息获取成功');
})

app.get('/updatePosition', function(req, res){

  console.log('更新岗位信息');
  position.update(1,res);
  // res.send('更新成功');
})

app.get('/getCrawlerInfo', function(req, res){

  console.log('获取上次爬取数据');
  position.getCrawlerInfo(res);
})

app.get('/getStatis', function(req, res){

  console.log('获取统计信息');
  position.getStatis(res);
})

//关注
app.post('/focus', function(req, res){
  const params = req.body;
  position.focus(params,res);
});

//删除
app.post('/del', function(req, res){
  const params = req.body;
  position.del(params,res);
});

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})