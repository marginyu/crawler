var express = require('express');
var bodyParser = require('body-parser');//解析,用req.body获取post参数
var session = require('express-session');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// 使用 session 中间件
app.use(session({
  secret :  'secret', // 对session id 相关的cookie 进行签名
  resave : true,
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie : {
    maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
  },
}));

// 允许所有的请求形式
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // 需要显示设置来源
  res.header ("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept" );
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS" );
  res.header("Access-Control-Allow-Credentials", true ); // 带cookies
  res.header("Content-Type", "application/json;charset=utf-8" );
  if(req.path == '/login' || (req.session && req.session.userName)) {
    next();
  }else{
    res.send({errcode: -1, msg: "登录失败"});
  }
});

var position = require('./service/position');

app.get('/', function (req, res) {
  console.log("主页 GET 请求");
  res.send('Hello world');
})

app.post('/login', function(req, res){
  console.log('=========login========');
  const name = req.body.name;
  const password = req.body.password;
  if(name == 'xiaomei' && password == 'loveminer'){
    req.session.userName = name;
    res.send({errcode: 0});
  }else{
    res.send({errcode: -1000, msg: "账号或者密码不正确"});
  }
})

// 退出
app.get('/logout', function (req, res) {
  req.session.userName = null; // 删除session
  res.send({errcode: 0});
});

app.post('/getPositionList', function (req, res) {
  console.log("获取岗位列表", req.body);
  const params = req.body;
  position.get(params,res);
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

var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
