var nodemailer = require('nodemailer');
var dateHelper = require('./date');
var statsHelper = require('./stats');

var sendMail = function(newQuestions, mailConfig, filterConfig, recipients, type){

    return new Promise(function(resolve, reject){
        var transporter = nodemailer.createTransport(mailConfig);

        var emailBody = "Mail Generated by Bug Reporter v3.0\n\n";
        emailBody += type + " Results for posts uploaded after " + dateHelper.lastDate +" \n\n";
        
        if(newQuestions.length == 0){
            emailBody += "No New Questions Raised";
        }

        var statsRes = statsHelper.getStats(newQuestions);
        var stats1 = statsRes.priStats;
        var stats2 = statsRes.secStats;
            
        if(stats1){
            var temp = stats1;
            // console.log(stats2)
            // console.log(temp);
            emailBody += "Primary Keyword Results - ";
            emailBody += "\n";
            for(var x = 0; x < temp[0].length; x++){
                emailBody += "\t" + temp[0][x] + ": " + temp[1][x];
                emailBody += "\n";
            }
        }

        if(stats2){
            var temp = stats2;
            // console.log(stats2)
            // console.log(temp);
            emailBody += "Secondary Keyword Results - ";
            emailBody += "\n";
            for(var x = 0; x < temp[0].length; x++){
                emailBody += "\t" + temp[0][x] + ": " + temp[1][x];
                emailBody += "\n";
            }
        }
        emailBody += "\n";

        for(var x = 0; x < newQuestions.length; x++){
            emailBody += "* " + newQuestions[x].quesTitle;
            if(filterConfig.nameOfCustomer){
                emailBody += ":- " + newQuestions[x].name;
            }
            emailBody += "\n";
            if(filterConfig.dateOfPost){
                emailBody += "Date of Post: " + newQuestions[x].date;
                emailBody += "\n";
            }
            if(filterConfig.questionBody){
                emailBody += "Details: " + newQuestions[x].questionDetails;
                emailBody += "\n";
            }
            if(filterConfig.baseCampLink){
                emailBody += "Base Camp Link: " + newQuestions[x].link;
                emailBody += "\n";
            }
            if(filterConfig.jiraLink && newQuestions[x].jiraLink){
                emailBody += "Jira Link: " + newQuestions[x].jiraLink;
                emailBody += "\n";
            }
            emailBody += "\n"; 
        }

        var mailOptions = {
            from: "no-reply-upgrades@kony.com",
            to: newQuestions.length > 0 ? recipients : 'hitesh.lalwani@kony.com',
            subject: type + ' Report : ' + newQuestions.length + " question(s) raised",
            text: emailBody
        };
        
        console.log('Sending Mail');
        // console.log(emailBody);
        transporter.sendMail(mailOptions, function(error, info){
            // dateHelper.writeLastDate();
            if (error) {
                console.log(error);
                resolve(error);
            } else {
                console.log(type + ' Email sent: ' + info.response);
                resolve(info);
            }
        });

    }); 

}

module.exports = {
    sendMail: sendMail
}