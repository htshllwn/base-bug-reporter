var path = require('path');
var CWD = process.cwd();
var fs = require('fs');
var _ = require('lodash');
var request = require('request');

var urls = {
    components_api: 'https://community.kony.com/api/v1_0/marketplace/item'
};

var keywords = require('./keywords/keywords');
var hidKeywords = keywords.hidden;
var priKeywords = keywords.primary;
var secKeywords = keywords.secondary;
var queriesKeywords = keywords.queries;

console.log('Keywords Before Update = >');
console.log('\tHidden: ' + hidKeywords.length);
console.log('\tPrimary: ' + priKeywords.length);
console.log('\tSecondary: ' + secKeywords.length);
console.log('\tQueries: ' + queriesKeywords.length);
console.log();

var updatePriKeywords = function () {
    return new Promise(function (resolve, reject) {
        console.log('-------------------------------------------------------');
        console.log('Fetching the latest components list');
        request.get({
            url: urls.components_api
        }, function (error, response, body) {
            if (!error) {
                var statusCode = response && response.statusCode;
                if (statusCode == 200) {
                    var jsonBody = JSON.parse(body);
                    var newList = jsonBody.Details;
                    console.log('New Components List: ' + newList.length);
                    priKeywords = newList.map(ele => ele.Title);
                    console.log('-------------------------------------------------------');
                    resolve(priKeywords);
                } else {
                    console.log('Response not equal 200');
                    console.log('-------------------------------------------------------');
                }
            } else {
                console.log('Error occurred while fetching the latest components list');
                console.log('-------------------------------------------------------');
            }
        });
    });
}

updatePriKeywords()
.then(priKeywords => {
    console.log('Keywords After Update = >');
    console.log('\tHidden: ' + hidKeywords.length);
    console.log('\tPrimary: ' + priKeywords.length);
    console.log('\tSecondary: ' + secKeywords.length);
    console.log('\tQueries: ' + queriesKeywords.length);
    console.log();

    var newKeywords = {
        hidden: hidKeywords,
        primary: priKeywords,
        secondary: secKeywords,
        queries: queriesKeywords
    }

    fs.writeFileSync('./keywords/keywords.json', JSON.stringify(newKeywords, null, 4));

})