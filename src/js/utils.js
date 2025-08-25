module.exports.jsonToCsv = function jsonToCsv(jsonArray) {
    const headers = Object.keys(jsonArray[0]);
    const csvHeader = headers.join(',');

    const csvRows = jsonArray.map(obj =>
        headers.map(header => {
            let value = obj[header] !== undefined && obj[header] !== null ? obj[header] : '';
            if (typeof value === 'object' ) {
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