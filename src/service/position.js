const lagou = require('../util/lagou');
const Db = require('../util/db');

const dbInstance = new Db();

function update(i=0, res){
  if(i === 0){
    console.time('crawler');
  }
  lagou.getPostionData(i, '深圳', '前端', function(data){
    if(data && data.length){
      if(i === 0) dbInstance.empty();
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
      dbInstance.insert(data);
      i++;
      update(i,res);
    }else{
      if(data === false){
        res.send('抓取失败，被拉勾反爬虫发现了');
      }else{
        console.timeEnd('crawler');
        console.log('抓取完毕');
        res.send('更新成功');
      }
    }
  });
}

function get(num, res){
  dbInstance.query('深圳','前端',num, function(rs){
    //console.log('拿到了', rs);
    res.send(rs);
  });
}


module.exports = {
  update:update,
  get:get
};