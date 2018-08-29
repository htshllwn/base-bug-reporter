var path = require('path');
var CWD = process.cwd();

module.exports = {
    dataDir: path.join(CWD, 'data'),
    collectionLoc: '/collection.json',
    lastDateLoc: '/lastDate.json',
    jiraColLoc: '/jiraResult.json'
}