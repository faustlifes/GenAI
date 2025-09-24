
const fileOp = require("./src/js/file-op");
const config = require('./res/config.json');
const utils = require("./src/js/utils");
const BOMParser = require("./src/js/BOM-parser");

/* Just run task for adding field to csv by config rules as an example
* */
console.log('time start: ', new Date().toString());

const runners = {
    addField: () => fileOp.addFieldByURL(config.addField.path.csv, config.addField.options),
    BOMConverter: () => BOMParser.licensesList(fileOp.getFile(`${config.BOMConverter.path}.json`)),
    convert: () => fileOp.convert(config.convert.path, config.convert.separator),
    csvToJson: () => {
        const csv = fileOp.getFile(config.csvToJson.path);
        const json = utils.csvToJson(csv, config.csvToJson.separator);
        fileOp.writeFile(config.csvToJson.path.replace('.csv', '.json'), JSON.stringify(json));
    },
    jsonToCsv: () => {
        const json = fileOp.getFile(config.jsonToCsv.path, config.jsonToCsv.separator);
        const arr = JSON.parse(json);
        const csv = utils.jsonToCsv(arr, true, config.jsonToCsv.separator);
        fileOp.writeFile(config.jsonToCsv.path.replace('.json', '.csv'), csv);
    },
    getFile: () => {
        const data = fileOp.getFile(config.getFile.path, config.getFile.encoding);
        console.log('getFile:', data);
    },
    writeFile: () => {
        fileOp.writeFile(config.writeFile.path, config.writeFile.data, config.writeFile.encoding);
        console.log('writeFile done');
    }
};
x
(async () => {
    for (const method of config.run) {
        if (runners[method]) {
            const result = await runners[method]();
            if (result) console.log(`${method} result:`, result);
        } else {
            console.warn(`No runner for method: ${method}`);
        }
    }
    console.log('time stop: ', new Date().toString());
})();
