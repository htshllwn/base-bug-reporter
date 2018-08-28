var config = require('./config');
var fs = require('fs');
var _ = require('lodash');

var hidKeywords = require('./keywords/hidden');
var priKeywords = require('./keywords/primary');
var secKeywords = require('./keywords/secondary');

var filterData = require('./helpers/filter-data');

if(!fs.existsSync(config.folders.dataDir)){
    fs.mkdirSync(config.folders.dataDir);
}

var nmRes = require('./helpers/nightmare-scrap');

nmRes.then(function(res){
    // console.log(res);
    collectionLoc = config.folders.dataDir + config.folders.collectionLoc;
    if(!fs.existsSync(collectionLoc)){
        collection = []
    } else {
        collection = JSON.parse(fs.readFileSync(collectionLoc));
    }

    var tempRes = _.uniqBy(res, 'name');

    var newQuestions = _.differenceBy(tempRes, collection,'name');
    var removedQuestions = _.differenceBy(collection, tempRes,'name');
    
    console.log("From File: " + collection.length);

    collection = collection.concat(tempRes);
    console.log("After Concat: " + collection.length);

    collection = _.uniqBy(collection, 'name');
    console.log("After uniqBy: " + collection.length);

    console.log('New Questions : ' + newQuestions.length);
    // console.log('Removed Questions : ' + removedQuestions.length);

    var filteredResult = filterData(newQuestions, hidKeywords, priKeywords, secKeywords);
    console.log('Filtered Results : ' + filteredResult.length);

    fs.writeFileSync(collectionLoc, JSON.stringify(collection, null, 4));

    console.log('res: ' + res.length);
    console.log('tempRes: ' + tempRes.length);
});
