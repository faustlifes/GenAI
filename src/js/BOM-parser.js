const utils = require("./utils");
const fileOp = require("./file-op");
const config = require('../../res/config.json');

function licensesList(json) {
    const data = JSON.parse(json);
    const components = data.components;
    const app = data.metadata?.component?.name;
    let result = [];
    for (const component of components) {
        const item = {};
        item.name = component.name;
        item.version = component.version;
        item.licenses = component.licenses?.map(license => license?.license?.id || license?.license?.name).join(',');
        item.group = component.group;
        item.app = app;
        result.push(item);
    }
    fileOp.writeFile(`${config.BOMConverter.path}.csv`, utils.jsonToCsv(result, false, ','));
    return result
}

module.exports = {
    licensesList
};