let  server = 'http://127.0.0.1:3000'; // 本地环境
if(window.location.origin == 'http://freego.ofo.com'){
  server = 'http://10.2.40.110:3000'; //线上环境
}

export default {
  server
}
