var config = require('./config');
var fs = require('fs');
var _ = require('lodash');

var hidKeywords = require('./keywords/hidden');
var priKeywords = require('./keywords/primary');
var secKeywords = require('./keywords/secondary');
var queriesKeywords = require('./keywords/queries');

var filterData = require('./helpers/filter-data');

if(!fs.existsSync(config.folders.dataDir)){
    fs.mkdirSync(config.folders.dataDir);
}

var nmRes = require('./helpers/nightmare-scrap');
var jiraRes = require('./helpers/jira');
var mail = require('./helpers/mail');
var dateHelper = require('./helpers/date');


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
    // var filteredResult = [];
    console.log('Filtered Results : ' + filteredResult.length);

    var queriesData = _.differenceBy(newQuestions, filteredResult,'quesTitle');
    var queries = filterData(queriesData, hidKeywords, priKeywords, queriesKeywords);
    console.log('Queries Results : ' + queries.length);

    //--------------------------------------------------------//
    //------------Send the queries Results to PMs-------------//
    //--------------------------------------------------------//
    var queryLoc = config.folders.dataDir + config.folders.queryColLoc;
    if(!fs.existsSync(queryLoc)){
        queryCollection = []
    } else {
        queryCollection = JSON.parse(fs.readFileSync(queryLoc));
    }
    queryCollection = queryCollection.concat(queries);
    fs.writeFileSync(queryLoc, JSON.stringify(queryCollection, null, 4));

    mail.sendMail(queries, config.mail, config.filter, config.queriesRecipients, "Query")
    .then(function(mailResult){
        console.log('Query sendMail resolved');
        // console.log(mailResult);
    });
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
            mail.sendMail(jiraResult, config.mail, config.filter, config.recipients, "Bug")
                .then(function(mailResult){
                    console.log('Bug sendMail resolved');
                    // console.log(mailResult);
                });

        });

    fs.writeFileSync(collectionLoc, JSON.stringify(collection, null, 4));

    console.log('res: ' + res.length);
    console.log('tempRes: ' + tempRes.length);
    dateHelper.writeLastDate();
})
    .catch(function(err) {
        console.log('nmRes catch. ERROR: ');
        console.log(err);
    });
