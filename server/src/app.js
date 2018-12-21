var express = require('express');
var app = express();
var position = require('./service/position');

app.get('/', function (req, res) {
  console.log("主页 GET 请求");
  res.send('Hello world');
})

app.get('/getPositionList', function (req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  console.log("获取岗位列表", req.query);
  var num = 10;
  var pageIndex = 0;
  if(req.query.pageIndex){
    pageIndex = parseInt(req.query.pageIndex) - 1;
  }
  position.get(num,pageIndex,res);
  //res.send('岗位列表信息获取成功');
})

app.get('/updatePosition', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  console.log('更新岗位信息');
  position.update(1,res);
  // res.send('更新成功');
})

app.get('/getCrawlerInfo', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  console.log('获取上次爬取数据');
  position.getCrawlerInfo(res);
})


app.get('/getStatis', function(req, res){
  res.header('Access-Control-Allow-Origin', '*');
  console.log('获取统计信息');
  position.getStatis(res);
})

var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})