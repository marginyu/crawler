var xlsx = require('node-xlsx').default;
var fs = require('fs');

// Parse a buffer
//const workSheetsFromBuffer = xlsx.parse(fs.readFileSync('./xlsx/financial.xlsx'));

// Parse a file
const workSheetsFromFile = xlsx.parse('./xlsx/financial.xlsx');


var data = workSheetsFromFile[0].data;

for(var item of data){
  var salary = item[6];
  var salaryArr = salary.split('-');
  if(salaryArr.length > 1){
    item.push(salaryArr[0].replace(/k|K/g,''));
    item.push(salaryArr[1].replace(/k|K/g,''));
  }
}

var buffer = xlsx.build([{name: "mySheetName", data: data}]); // Returns a buffer

fs.writeFileSync('./xlsx/financial.xlsx', buffer);