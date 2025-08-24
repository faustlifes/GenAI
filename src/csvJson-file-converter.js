const utils = require("./utils");
const fs = require("fs");


module.exports.convert = (fileName = "res/byram/test_data") => {
    let res = [];
    try {
        const csvData = fs.readFileSync(`${fileName}.csv`, 'utf8');
        res = utils.csvToJson(csvData);
        fs.writeFileSync(`${fileName}.json`, res);
    } catch (err) {
        console.error('Error reading file:', err);
    }
}


