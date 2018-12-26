const lagou = require('../util/lagou');
const Db = require('../util/db');

const dbInstance = new Db();

function update(i=1, res, total=0){
  if(i === 1){
    console.time('crawler');
  }
  lagou.getPostionData(i, '深圳', '前端', function(data){
    if(data && data.length){
      data = data.map(function(item,index){
        var salary = item.salary;
        var salaryArr = salary.split('-');
        if(salaryArr.length > 1){
          item.minSalary = parseInt(salaryArr[0].replace(/k|K/g,''));
          item.maxSalary = parseInt(salaryArr[1].replace(/k|K/g,''));
        }else{
          item.minSalary = 0;
          item.maxSalary = 0;
        }
        return item;
      });
      console.log('当前分页'+i+',累计总数'+(total+data.length));
      if(i === 1) {
        dbInstance.empty(function(){ dbInstance.insert(data);});
      } else {
        dbInstance.insert(data);
      }
      i++;
      setTimeout(function(){
        update(i,res, total + data.length);
      }, 0);
    }else{
      if(data === false){
        res.send('抓取失败，被拉勾反爬虫发现了');
      }else{
        console.timeEnd('crawler');
        console.log('抓取完毕');
        var t = new Date();
        dbInstance.addcrawlerRecord({
          "time": t.toLocaleDateString() + " " + t.toTimeString(),
          "num": total
        });
        res.send('更新成功');
      }
    }
  });
}

function get(num, pageIndex, res){
  dbInstance.query('深圳','前端',num, pageIndex, function(rs){
    //console.log('拿到了', rs);
    res.send(rs);
  });
}

function getCrawlerInfo(res){
  dbInstance.getNewestCrawlerRecord(function(rs){
    res.send(rs);
  })
};

function getStatis(res){
  dbInstance.getStatis(function(rs){
    res.send(rs);
  })
};

function focus(id, res){
  dbInstance.focus(id, function(rs){
    res.send(rs);
  })
};

function del(id, res){
  dbInstance.del(id, function(rs){
    res.send(rs);
  })
};


module.exports = {
  update:update,
  get:get,
  getCrawlerInfo:getCrawlerInfo,
  getStatis: getStatis,
  focus,
  del,
};