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
var jiraRes = require('./helpers/jira');
var mail = require('./helpers/mail');


//--------------------------------------------------------//
//---------------------Scrap Websites---------------------//
//--------------------------------------------------------//
nmRes.then(function(res){
    // console.log(res);
    collectionLoc = config.folders.dataDir + config.folders.collectionLoc;
    if(!fs.existsSync(collectionLoc)){
        collection = []
    } else {
        collection = JSON.parse(fs.readFileSync(collectionLoc));
    }

    var tempRes = _.uniqBy(res, 'quesTitle');

    var newQuestions = _.differenceBy(tempRes, collection,'quesTitle');
    var removedQuestions = _.differenceBy(collection, tempRes,'quesTitle');
    
    console.log("From File: " + collection.length);

    collection = collection.concat(tempRes);
    console.log("After Concat: " + collection.length);

    collection = _.uniqBy(collection, 'quesTitle');
    console.log("After uniqBy: " + collection.length);

    console.log('New Questions : ' + newQuestions.length);
    // console.log('Removed Questions : ' + removedQuestions.length);

    var filteredResult = filterData(newQuestions, hidKeywords, priKeywords, secKeywords);
    console.log('Filtered Results : ' + filteredResult.length);

    //--------------------------------------------------------//
    //------Raise Issues in JIRA for the filtered Results-----//
    //--------------------------------------------------------//

    jiraRes.raiseIssues(filteredResult)
        .then(function(jiraResult){
            var jiraLoc = config.folders.dataDir + config.folders.jiraColLoc;
            if(!fs.existsSync(jiraLoc)){
                jiraCollection = []
            } else {
                jiraCollection = JSON.parse(fs.readFileSync(jiraLoc));
            }
            jiraCollection = jiraCollection.concat(jiraResult);
            fs.writeFileSync(jiraLoc, JSON.stringify(jiraCollection, null, 4));

            // console.log(jiraResult);

            //--------------------------------------------------------//
            //-----------------------Send Mail------------------------//
            //--------------------------------------------------------//
            mail.sendBugsMail(jiraResult, config.mail, config.filter, config.recipients)
                .then(function(mailResult){
                    console.log('sendBugsMail resolved');
                    // console.log(mailResult);
                });

        });

    fs.writeFileSync(collectionLoc, JSON.stringify(collection, null, 4));

    console.log('res: ' + res.length);
    console.log('tempRes: ' + tempRes.length);
});
