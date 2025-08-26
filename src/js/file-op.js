const utils = require("./utils");
const fs = require("fs");


function convert (fileName) {
        //const csvData = fs.readFileSync(`${fileName}.csv`, 'utf8');
        const data = utils.csvToJson(getFile(`${fileName}.csv`));
        writeFile(`${fileName}.json`, data);
        // fs.writeFileSync(`${fileName}.json`, res);
}

function getFile  (filePath = '') {
    let res;
    try {
        res = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('Error reading file:', err);
    }
    return res;
}

function writeFile (filePath = '', data) {
    try {
       fs.writeFileSync(filePath, data);
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

module.exports.getFile = getFile;
module.exports.writeFile = writeFile;
module.exports.convert = convert;

