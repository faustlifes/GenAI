const https = require('https');

/**
 * Converts a JSON array to a CSV string, with optional header.
 * @param {Array} jsonArray
 * @param {boolean} [header=true]
 * @param {string} [separator=',']
 * @returns {string}
 */
function jsonToCsv(jsonArray, header = true, separator = ',') {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        return '';
    }
    const headers = Object.keys(jsonArray[0]);
    const csvHeader = headers.join(separator);
    const csvRows = jsonArray.map(obj =>
        headers.map(h => {
            let value = obj[h] !== undefined && obj[h] !== null ? obj[h] : '';
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return typeof value === 'string' && (value.includes(separator) || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(separator)
    );
    return header ? [csvHeader, ...csvRows].join('\n') : csvRows.join('\n');
}

/**
 * Converts a CSV string to a JSON array.
 * @param {string} csvString
 * @param {string} [separator=',']
 * @returns {Array}
 */
function csvToJson(csvString, separator = ',') {
    if (!csvString || typeof csvString !== 'string') return [];
    const rows = csvString.trim().split('\n');
    if (rows.length < 2) return [];
    const headers = rows[0].split(separator);
    const jsonData = [];
    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(separator);
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            const key = headers[j].trim().replace(/"/g, '');
            obj[key] = values[j] ? values[j].trim().replace(/"/g, '') : '';
        }
        jsonData.push(obj);
    }
    return jsonData;
}

/**
 * Splits a CSV string by limit.
 * @param {string} input
 * @param {number} [limit=4]
 * @returns {Array<Array<string>>}
 */
function limiter(input, limit = 4) {
    if (!input || typeof input !== 'string') return [[]];
    const data = input.split('\n');
    const res = [[]];
    let i = 0, j = 0, index = 0;
    while (i < data.length) {
        if (j >= limit) {
            j = 0;
            index += 1;
            res.push([]);
        }
        res[index].push(data[i]);
        j++;
        i++;
    }
    return res;
}

/**
 * Fetches data from a URL using HTTP GET with basic auth.
 * @param {object} auth
 * @param {string} auth.login
 * @param {string} auth.pass
 * @param {string} url
 * @returns {Promise<string|null>}
 */
function getData(auth = { login: '', pass: '' }, url = '') {
    if (!url) {
        return Promise.resolve(null);
    }
    const credentials = Buffer.from(`${auth.login}:${auth.pass}`).toString('base64');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    const options = {
        port: 443,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Node.js HTTP Client',
            'Authorization': `Basic ${credentials}`
        }
    };
    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(data);
            });
        });
        req.on('error', (e) => {
            console.error(`Problem with request: ${url}`);
            console.error(e);
            reject(e);
        });
        req.end();
    });
}

module.exports = {
    jsonToCsv,
    csvToJson,
    limiter,
    getData
};
