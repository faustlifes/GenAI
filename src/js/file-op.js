const utils = require("./utils");
const fs = require("fs");

/**
 * Convert file from CSV to JSON and write to file by path, automatically adding extensions
 * @param {string} filePath
 * @param {string} [separator=',']
 * @returns {void}
 */
function convert(filePath, separator = ',') {
    if (!filePath) {
        console.error('No file path provided to convert.');
        return;
    }
    try {
        const csvData = getFile(`${filePath}.csv`);
        if (!csvData) throw new Error('CSV file is empty or not found.');
        const jsonData = utils.csvToJson(csvData, separator);
        writeFile(`${filePath}.json`, jsonData);
    } catch (err) {
        console.error('Error converting file:', err);
    }
}

/**
 * Reads file from local machine path
 * @param {string} filePath
 * @param {string} [encoding='utf8']
 * @returns {string|null}
 */
function getFile(filePath = '', encoding = 'utf8') {
    try {
        return fs.readFileSync(filePath, encoding);
    } catch (err) {
        console.error(`Error reading file (${filePath}):`, err);
        return null;
    }
}

/**
 * Writes data to the file by path
 * @param {string} filePath
 * @param {any} data
 * @param {string} [encoding='utf8']
 * @returns {void}
 */
function writeFile(filePath = '', data, encoding = 'utf8') {
    try {
        fs.writeFileSync(filePath, data, { encoding });
    } catch (err) {
        console.error(`Error writing file (${filePath}):`, err);
    }
}

/**
 * Adds field to CSV by fetching payload from URL and resaves CSV with UPD postfix
 * @param {string} path
 * @param {object} options
 * @param {string} [options.fieldFrom]
 * @param {string} [options.fieldTo]
 * @param {object} [options.basicAuth]
 * @param {RegExp} [options.matcher]
 * @param {string} [options.separator]
 * @returns {Promise<void>}
 */
async function addFieldByURL(
    path,
    options = {
        fieldFrom: '',
        fieldTo: '',
        basicAuth: { login: '', pass: '' },
        matcher: / /g,
        separator: ','
    }
) {
    if (!path) {
        console.error('No path provided to addFieldByURL.');
        return;
    }
    try {
        const data = getFile(`${path}.csv`);
        if (!data) throw new Error('CSV file is empty or not found.');
        const jsonArray = JSON.parse(utils.csvToJson(data, options.separator));
        let result = '';
        for (const el of jsonArray) {
            const payload = await utils.getData(options.basicAuth, el[options.fieldFrom]);
            el[options.fieldTo] = payload ? JSON.parse(payload) : null;
            el.addFieldsUSed = payload ? !!payload.match(options.matcher) : false;
            result += `\n${utils.jsonToCsv([el], false, options.separator)}`;
        }
        writeFile(`${path}_UPD.csv`, result);
    } catch (err) {
        console.error('Error in addFieldByURL:', err);
    }
}

module.exports = {
    addFieldByURL,
    getFile,
    writeFile,
    convert
};

