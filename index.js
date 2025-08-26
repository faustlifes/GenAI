
const fileOp = require("./src/js/file-op");
const config = require('./res/config.json');

/* Just run task for adding field to csv by config rules as an example
* */
console.log('time start: ', new Date().toString());
fileOp.addFieldByURL(config.addField.path.csv, config.addField.options).then(() => console.log('time stop: ', new Date().toString()));