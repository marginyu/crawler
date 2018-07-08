const superagent = require('superagent');
const cheerio = require('cheerio');
var xlsx = require('node-xlsx').default;
var fs = require('fs');
var startIndex = 1;
var xlsxName = './sz-all.xlsx';
var city = '深圳';

const columns = [
  "companyShortName","companySize","financeStage","companyLabelList","industryField",
  "positionName","salary", "positionAdvantage",
  "companyFullName","workYear","education",
  "district","businessZones",
  "formatCreateTime"
];
function format(arr){
  var rs = [];
  for(var item of arr){
    var itemArr = [];
    for(var key of columns){

      var _data = typeof item[key] != 'undefined' ? item[key]: '';

      if(key == 'salary'){
        var salaryArr = _data.split('-');
        if(salaryArr.length > 1){
          itemArr.push(parseInt(salaryArr[0].replace(/k|K/g,'')));
          itemArr.push(parseInt(salaryArr[1].replace(/k|K/g,'')));
        }else{
          itemArr.push(0);
          itemArr.push(0);
        }
      }else if(key == 'companyShortName'){
        itemArr.push(_data);
        itemArr.push('https://www.lagou.com/gongsi/' + item["companyId"] + '.html');
      }else if(key == 'positionName'){
        itemArr.push(_data);
        itemArr.push('https://www.lagou.com/jobs/' + item["positionId"] + '.html');
      }else{
        //如果是数组类型
        if(_data instanceof Array){
          _data = _data.join(",");
        }
        itemArr.push(_data);
      }
    }
    rs.push(itemArr);
  }
  return rs;
}

function writeToXlsx(data){
  const workSheetsFromFile = xlsx.parse(xlsxName);
  var original = workSheetsFromFile[0].data;
  //添加数据
  var newData = original.concat(data);
  var buffer = xlsx.build([{name: "mySheetName", data: newData}]); // Returns a buffer
  fs.writeFileSync(xlsxName, buffer);
}

const reptileUrl = 'https://www.lagou.com/jobs/positionAjax.json';

function getData(pn){
  superagent.post(reptileUrl).query({
    //jd: '未融资,上市公司,不需要融资',
    //hy: '电子商务',
    px: 'default',
    city: city,
    first: false,
    pn: pn,
    kd: '前端',
    needAddtionalResult: false
  }).set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Origin', 'https://www.lagou.com')
    .set('Cookie', 'gsScrollPos-2391=0; WEBTJ-ID=20180628192657-16446257420164-01987e7ad3316c-17356953-1296000-164462574217b9; _ga=GA1.2.207245968.1530185217; user_trace_token=20180628192657-2b06f7ea-7ac6-11e8-975a-5254005c3644; LGUID=20180628192657-2b070069-7ac6-11e8-975a-5254005c3644; X_HTTP_TOKEN=a71ccb398a4b1b2570767265bf30ddbe; _putrc=4A0C9E8DC8F5EBFE; JSESSIONID=ABAAABAAAGGABCB071273EC73269885C1AAA083A3E4A256; login=true; unick=%E4%BD%99%E6%A2%85%E5%BF%A0; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=0; index_location_city=%E6%B7%B1%E5%9C%B3; gsScrollPos-1400=0; _gid=GA1.2.437676783.1530431081; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1530431081,1530497850; LG_LOGIN_USER_ID=9f442ed070db372b2ee525940d5861cb1f4eb33a34a03980; gate_login_token=3dd25e9a751d3528ec2fe886ac8a66792fdb1f2407fb43b7; PRE_HOST=; PRE_SITE=; LGSID=20180703104642-51839769-7e6b-11e8-98e2-5254005c3644; PRE_UTM=m_cf_cpt_baidu_pc; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Flp%2Fhtml%2Fcommon.html%3Futm_source%3Dm_cf_cpt_baidu_pc; SEARCH_ID=adb3b479fdb44e9d8ee755f58c4a0326; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1530586068; LGRID=20180703104747-77fc41cb-7e6b-11e8-bd33-525400f775ce; TG-TRACK-CODE=search_code')
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
    .set('Host', 'www.lagou.com')
    .set('Referer', 'https://www.lagou.com/jobs/list_web?labelWords=&fromSearch=true&suginput=')
    .end(function (err, res) {
      // 抛错拦截
      if(err){
        console.log(err);
      }
      var rs = JSON.parse(res.text);
      if(rs.success){
        console.log('>>>>>成功了<<<<<<,当前分页：'+ pn);
        var data = rs.content.positionResult.result;
        var finalData = format(data);
        //console.log(finalData);
        writeToXlsx(finalData);
        console.log(pn + ':excel写入成功');
        if(data.length > 0){
          console.log('请求新的分页：' + (pn+1));
          //间隔2秒
          setTimeout(function(){
            getData(pn+1);
          },2500);
        }
      }else{
        console.log('操作失败');
      }
    });
}

getData(startIndex);