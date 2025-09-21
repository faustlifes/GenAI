
const fileOp = require("./src/js/file-op");
const config = require('./res/config.json');
const utils = require("./src/js/utils");
const BOMParser = require("./src/js/BOM-parser");

/* Just run task for adding field to csv by config rules as an example
* */
console.log('time start: ', new Date().toString());
//fileOp.addFieldByURL(config.addField.path.csv, config.addField.options).then(() => console.log('time stop: ', new Date().toString()));
/*fileOp.writeFile(
    `${config.addField.path.csv}_UPD.csv`, 
    utils.jsonToCsv(JSON.parse(fileOp.getFile(`${config.addField.path.json}.json`)), 
    true, ','));
console.log('time stop: ', new Date().toString());*/


console.log(BOMParser.licensesList(fileOp.getFile(`${config.BOMConverter.path}.json`)));
