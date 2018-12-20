var xlsx = require('node-xlsx').default;
var fs = require('fs');

const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
const range = {s: {c: 0, r:0 }, e: {c:0, r:0}}; // A1:A4
const option = {'!merges': [ range ]};

var buffer = xlsx.build([{name: "mySheetName", data: data}], option); // Returns a buffer
fs.writeFileSync('./test.xlsx', buffer);