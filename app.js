var config = require('./config');
var fs = require('fs');

var hidKeywords = require('./keywords/hidden');
var priKeywords = require('./keywords/primary');
var secKeywords = require('./keywords/secondary');

if(!fs.existsSync(config.folders.dataDir)){
    fs.mkdirSync(config.folders.dataDir);
}

var nmRes = require('./helpers/nightmare-scrap');

nmRes.then(function(res){
    // console.log(res);
    console.log('nmRes then ' + res.length);
})