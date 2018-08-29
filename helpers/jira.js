var path = require('path');
var CWD = process.cwd();
var jiraConfig = require(path.join(CWD,'config','jira'));

JiraApi = require('jira').JiraApi;

var jira = new JiraApi(jiraConfig.protocol, jiraConfig.host, jiraConfig.port, jiraConfig.user, jiraConfig.password, jiraConfig.version);

var raiseIssues = function(newQuestions){
    var issueRaisePromise = new Promise(function(resolve, reject) {
        var jiraResCount = 0;
        resultData = [];
        for(var x = 0; x < newQuestions.length; x++){
            var issue_dict = [];
            issue_dict[x] = {
                "project": {"key": "MARA"},
                "issuetype": {"name": "Bug"},
                "components" :[{"name" : "Marketplace Assets", "id":"12288"}],
                "summary": newQuestions[x].quesTitle + " :- " + newQuestions[x].name,
                "description": newQuestions[x].quesDetails + ". Link: " + newQuestions[x].link,
                "customfield_15377":{	"value": "Nutan Karamcheti", //Engineering Manager
                                        "id":"16947"
                                    },
                "customfield_11400":{  //Severity
                                        "value": "Critical"
                                    },
                "fixVersions":[{ "name": "SP4-GA_MP" }], //Fix Version
                "customfield_10700":{   //Source
                                        "value":  "Regression" //"UAT"
                                    },
                "assignee":{
                                "name":  "prabhakar.katlakunta", //"UAT",
                                "key": "prabhakar.katlakunta",
                                "emailAddress": "prabhakar.katlakunta@kony.com"
                                    }
            };
    
            var value = issue_dict[x];
            var ques = newQuestions[x];
            // console.log(ques);
            getSomeData(value, ques, x)
                .then(function(result) {
                    console.log(result);
                });
    
            async function getSomeData(value, ques, ind){
                try {
                    var key; 
                    await jira.addNewIssue({
                        fields: value
                    }, function(err, res) {
                        if(err !== null){
                            console.log("+++++ Jira Issue could NOT be raised : ");
                            console.log("+++++ ERROR : ");
                            console.log(err);
                        }
                        if(res !== null){
                            console.log("+++++ Jira Issue successfully raised : " + res.key);
                            // console.log("+++++ RESULT : ");
                            // console.log(res);
                            ques.jiraLink = "https://konysolutions.atlassian.net/browse/" + res.key;
                            resultData.push(ques);
                            jiraResCount++; 
    
                            if(jiraResCount == newQuestions.length){
                                console.log('Jira Issue Raise Promise Resolving');
                                resolve(resultData);
                            }
                            
                        }
                        console.log("------------------");
                    });
                    // return key;
                }
                catch(error){
                    // Handle error
                }
            };
    
          
        }
    });
    return issueRaisePromise;
}

module.exports = {
    raiseIssues: raiseIssues,
}
