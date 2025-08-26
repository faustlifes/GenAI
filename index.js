
const fileOp = require("./src/js/file-op");
const utils = require("./src/js/utils");
const config = require('./res/config.json');



async function addField(path) {
    if (!path) {
        return;
    }
    const data = fileOp.getFile(`${path}.csv`);
    const jsonArray = JSON.parse(utils.csvToJson(data));
    for (let i = 0; i < jsonArray.length; i++) {
        const el = jsonArray[i];
        const payload = await utils.getData(config.basicAuth, el['request.payload.url']);
        el['request.payload'] = JSON.parse(payload);
        el.addFieldsUSed = checkAddField(payload);
    }

    fileOp.writeFile(`${path}_UPD.json`, JSON.stringify(jsonArray));
}


function checkAddField(str) {
    const match = /"HCPC [0-9]": "Y"|"HCPC [0-9][0-9]": "Y"|"Commercial [0-9]": "Y"/g;
    return str.match(match);
}

console.log('time start: ', new Date().toString());
addField(config.path.csv).then(() => console.log('time stop: ', new Date().toString()));