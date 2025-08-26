const utils = require("./utils");
const fs = require("fs");

/**
 * convert file from csv to json and write to file by path automatically add extensions
 * @param {string} filePath
 * @param {string} separator
 * @returns void
 */
function convert (filePath, separator = ',') {
        const data = utils.csvToJson(getFile(`${filePath}.csv`), separator);
        writeFile(`${filePath}.json`, data);
}

/**
 * getFile return file from local machine path
 * @param {string} filePath
 * @returns {string}
 */
function getFile  (filePath = '') {
    let res;
    try {
        res = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error('Error reading file:', err);
    }
    return res;
}

/**
 * writeFile write {data} to the file by path
 * @param {string} filePath
 * @param {any} data
 * @returns void
 */
function writeFile (filePath = '', data) {
    try {
       fs.writeFileSync(filePath, data);
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

/**
 * addFieldByURL get csv file by path, then convert to json array fetching payload by config options condtions and resave csv back with UPD postfix
 * @param {string} path
 * @param {object} options
 * @returns Promise<void>
 */
async function addFieldByURL(path, options = { fieldFrom: '', fieldTo: '', basicAuth: { login: '', pass: ''}, matcher: / /g, separator: ',' }) {
    if (!path) {
        return;
    }

    const data = getFile(`${path}.csv`);
    const jsonArray = JSON.parse(utils.csvToJson(data, options.separator));
    let result = '';
    for (let i = 0; i < jsonArray.length; i++) {
        const el = jsonArray[i];
        const payload = await utils.getData(options.basicAuth, el[options.fieldFrom]);
        el[options.fieldTo] = payload? JSON.parse(payload) : null;
        el.addFieldsUSed =  payload ? !!payload.match(options.matcher) : false;
        result += `
        ${utils.jsonToCsv([el], false, options.separator)}`;
    }

    writeFile(`${path}_UPD.csv`, result);
}


module.exports.addFieldByURL = addFieldByURL;
module.exports.getFile = getFile;
module.exports.writeFile = writeFile;
module.exports.convert = convert;

