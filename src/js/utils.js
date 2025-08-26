const https = require('https');

module.exports.jsonToCsv = function jsonToCsv(jsonArray) {
    const headers = Object.keys(jsonArray[0]);
    const csvHeader = headers.join(',');

    const csvRows = jsonArray.map(obj =>
        headers.map(header => {
            let value = obj[header] !== undefined && obj[header] !== null ? obj[header] : '';
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            return typeof value === 'string' && (value.includes(',') || value.includes('"'))
                ? `"${value.replace(/"/g, '""')}"`
                : value;
        }).join(',')
    );

    return [csvHeader, ...csvRows].join('\n');
}

//console.log (jsonToCsv(jsonArray));

module.exports.csvToJson = function csvToJson(csvString) {
    const rows = csvString.trim().split('\n'); // Split into lines and remove trailing whitespace
    const headers = rows[0].split(','); // Extract headers from the first line
    const jsonData = [];

    for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',');
        const obj = {};

        for (let j = 0; j < headers.length; j++) {
            const key = headers[j].trim(); // Trim whitespace from header keys
            // Trim whitespace from values
            obj[key] = values[j].trim();
        }
        jsonData.push(obj);
    }
    return JSON.stringify(jsonData); // Convert the array of objects to a JSON string
}

module.exports.limiter = function limiter(input, limit = 4) {
    let [i, j, index] = [0, 0, 0];
    const data = input.split('\n');
    let res = [[]];
    while (i < data.length) {
        if (j > limit) {
            j = 1;
            index += 1;
            res.push([data[i]]);
        } else {
            res[index].push(data[i]);
            j++;
        }
        i++;
    }
    return res;
}

module.exports.getData = function (auth = {login: "", pass: ""}, url = '') {
    const credentials = Buffer.from(`${auth.login}:${auth.pass}`).toString('base64');
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const options = {
        port: 443, // or 443 for https
        method: 'GET', // or 'POST', 'PUT', 'DELETE', etc.
        headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Node.js HTTP Client',
            'Authorization': `Basic ${credentials}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                //console.log('Response:', data);
                resolve(data);
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            reject(e);
        });

        // For POST or PUT requests, write data to the request body
        // req.write(JSON.stringify({ key: 'value' }));

        req.end();
    });

}
