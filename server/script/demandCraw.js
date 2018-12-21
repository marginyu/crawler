const superagent = require('superagent');
const cheerio = require('cheerio');

function craw(positionId,callback){
  // 定义网络爬虫的目标地址
  var url = 'https://www.lagou.com/jobs/'+positionId+'.html';

  superagent.post(url).query({}).set('Content-Type', 'application/x-www-form-urlencoded')
    .set('Origin', 'https://www.lagou.com')
    .set('Cookie', 'gsScrollPos-2391=0; WEBTJ-ID=20180628192657-16446257420164-01987e7ad3316c-17356953-1296000-164462574217b9; _ga=GA1.2.207245968.1530185217; user_trace_token=20180628192657-2b06f7ea-7ac6-11e8-975a-5254005c3644; LGUID=20180628192657-2b070069-7ac6-11e8-975a-5254005c3644; X_HTTP_TOKEN=a71ccb398a4b1b2570767265bf30ddbe; _putrc=4A0C9E8DC8F5EBFE; JSESSIONID=ABAAABAAAGGABCB071273EC73269885C1AAA083A3E4A256; login=true; unick=%E4%BD%99%E6%A2%85%E5%BF%A0; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=0; index_location_city=%E6%B7%B1%E5%9C%B3; gsScrollPos-1400=0; _gid=GA1.2.437676783.1530431081; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1530431081,1530497850; LG_LOGIN_USER_ID=9f442ed070db372b2ee525940d5861cb1f4eb33a34a03980; gate_login_token=3dd25e9a751d3528ec2fe886ac8a66792fdb1f2407fb43b7; PRE_HOST=; PRE_SITE=; LGSID=20180703104642-51839769-7e6b-11e8-98e2-5254005c3644; PRE_UTM=m_cf_cpt_baidu_pc; PRE_LAND=https%3A%2F%2Fwww.lagou.com%2Flp%2Fhtml%2Fcommon.html%3Futm_source%3Dm_cf_cpt_baidu_pc; SEARCH_ID=adb3b479fdb44e9d8ee755f58c4a0326; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1530586068; LGRID=20180703104747-77fc41cb-7e6b-11e8-bd33-525400f775ce; TG-TRACK-CODE=search_code')
    .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36')
    .set('Host', 'www.lagou.com')
    .set('Referer', 'https://www.lagou.com/jobs/list_web?labelWords=&fromSearch=true&suginput=')
    .end(function (err, res){
      // 抛错拦截
      if(err){
        console.warn('数据抓取失败', err);
        callback && callback(null);
      }else{
        const _res = filterDemand(res.text);
        callback && callback(_res);
        //console.log(_res);
      }
    });
}

/* 过滤页面信息 */
function filterDemand(html) {
  if (html) {
    // 沿用JQuery风格，定义$
   // var $ = cheerio.load('<div class = "job_bt"><div><p>xiaomei</p>abc</div></div>');
    var $ = cheerio.load(html, {decodeEntities: false});
    var t = $('.job_bt').find('div');
    if(t.html()){
      return t.html().trim();
    }
    return null;
  } else {
    console.log('无数据传入！');
  }
}

function main(){
  var MongoClient = require('mongodb').MongoClient;
  var url = "mongodb://localhost:27017/";
  // 只获取薪资最高的20条记录
  var index = 1;
  MongoClient.connect(url, { useNewUrlParser: true },async function(err, db) {
    if (err) throw err;
    console.log("数据库已创建!");
    var dbase = db.db("lagou");
    const result  = await dbase.collection("job").find({"city":'深圳', "demandHtml":null}).sort({"minSalary": -1}).limit(500).toArray();
    console.log('长度',result.length);
    result.map(function(item,index2){
      //console.log('item', item);
      craw(item.positionId, async function(demandInfo){
        //console.log(item.positionId+'的岗位要求：',demandInfo);
        console.log('序号：'+(index++)+',岗位id:'+item.positionId + '成功了');
        await dbase.collection("job").update({_id:item._id},{ $set:{demandHtml:demandInfo} },true);
        // if(index2 == result.length -1 ){
        //   console.log('db连接关闭');
        //   db.close();
        // }
      });
    });
  });
}

main();