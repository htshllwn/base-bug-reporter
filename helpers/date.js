var path = require('path');
var CWD = process.cwd();
var moment = require('moment');
var folders = require(path.join(CWD,'config','folders'))
var fs = require('fs');


function today() {
    var now = moment();
    var today = now.format("MMMM D, YYYY h:mm a");
    return today;
}

function lastDate() {
    if(!fs.existsSync(folders.dataDir + folders.lastDateLoc)){
        console.log('Last Date Not Found');
        return "June 8, 2018 11:44 AM";
    }
    else {
        return JSON.parse(fs.readFileSync(folders.dataDir + folders.lastDateLoc)).date;
    }
}

function writeLastDate() {
    fs.writeFileSync(folders.dataDir + folders.lastDateLoc,JSON.stringify({ "date": today() }, null, 4));
}

module.exports = {
    today: today(),
    lastDate: lastDate(),
    writeLastDate: writeLastDate
}