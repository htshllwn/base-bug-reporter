var path = require('path');
var CWD = process.cwd();
var urls = require(path.join(CWD, 'config', 'urls'));
var Nightmare = require('nightmare');
var nmConfig = require(path.join(CWD, 'config', 'nightmare'));


var moment = require('moment');

var now = moment();
var dateHelper = require('./date');
var today = dateHelper.today;
var lastDate = dateHelper.lastDate;

console.log("No. of websites to be scraped " + urls.length);

var promise = new Promise(function (resolve, reject) {
    // do a thing, possibly async, then…
    var resCount = 0;
    var tempRes = [];
    for (var urlsInd = 0; urlsInd < urls.length; urlsInd++) {

        console.log('Run no : ' + urlsInd + ' at ' + urls[urlsInd].name + ' starting');
        getData(urls[urlsInd], urlsInd)
            .then(function (res) {
                resCount++;
                // console.log('Result-- ' + res + ' --done');
                if (resCount == urls.length) {
                    // fs.writeFileSync(folders.dataDir + folders.lastDateLoc,JSON.stringify(today));
                    resolve(res);
                }
            });

        async function getData(url, urlsInd) {

            try {

                var elementWait = ".cuf-feed > .cuf-feedElementIterationItem:nth-child(1) > .cuf-element > article";

                // console.log('URL : ' + url);
                var nightmare = Nightmare(nmConfig);
                await nightmare
                    .goto(url.href)
                    // .wait("span.cuf-sortLabelTriggerWrapper")
                    // .click("span.cuf-sortLabelTriggerWrapper")
                    .wait(".slds-input.slds-combobox__input")
                    .click(".slds-input.slds-combobox__input")
                    .wait("lightning-base-combobox-item:nth-of-type(2)")
                    .click("lightning-base-combobox-item:nth-of-type(2)")
                    .wait("ul.compactFeedList > li:nth-child(1)")
                    .exists("ul.compactFeedList > li:nth-child(1)")
                    // .wait(".cuf-feed > .cuf-feedElementIterationItem:nth-child(1) > .cuf-element > article")
                    // .exists(".cuf-feed > .cuf-feedElementIterationItem:nth-child(1) > .cuf-element > article")
                    .then(function (res) {
                        if (res) {
                            console.log('First Post Found in ' + url.href + ' ... ');
                            // console.log(res);
                            return postExists2(nightmare, 1, 1, []);
                        } else {
                            console.log('First Post NOT Found in ' + url.href + ' ... ');
                            console.log(res);
                            return false;
                        }
                    })
                    .then(function (result) {
                        // console.log("then after while result " + JSON.stringify(result) );

                        var fetchedData = [];
                        // console.log('+++ This is the first promise after we clicked log off: ' + JSON.stringify(result));
                        // result.forEach(element => {
                        for (var a = 0; a < result.length; a++) {
                            var element = result[a];
                            // console.log();
                            // console.log("-----------------------------------------------------------------");
                            // console.log();

                            var name, date, quesTitle, quesDetails, tags = [], link = element.href;

                            var data1 = element.children[0].data;
                            date = extractDate(data1);

                            data1 = data1.split("\n");
                            // console.log(data1);
                            var ind = data1[1].indexOf('asked a question');


                            if (ind == -1) {
                                continue;
                            }
                            else {
                                name = data1[1].substring(0, ind - 1);
                            }

                            // var patt = /\w+\s\d{2},\s\d{4}/;
                            // var patt = /\w{3,9}?\s\d{1,2}?,\s\d{4}?/;
                            // date = patt.exec(data1[2]);
                            // date = date[0];
                            // var pattern = "at";
                            // date += " " + data1[2].substr(data1[2].indexOf(pattern) + pattern.length + 1, data1[2].length).trim();
                            // date = data1[2].replace(" at ", " ");

                            var data2 = element.children[1].data;
                            // data2 = data2.split("\n");
                            // console.log(data2);
                            quesTitle = data2;

                            var data3 = element.children[2].data;
                            // data3 = data3.split("\n");
                            // console.log(data3);
                            quesDetails = data3;

                            var data4 = element.children[3].data;
                            data4 = data4.split("\n");
                            // console.log(data4, element.children.length);

                            var data5 = element.children[4].data;
                            data5 = data5.split("\n");
                            // console.log(data5, element.children.length);

                            if (element.children.length == 6) {
                                for (var i = 0; i < data4.length - 1; i++) {
                                    tags.push(data4[i]);
                                }
                            }
                            else {
                                for (var i = 0; i < data5.length - 1; i++) {
                                    tags.push(data5[i]);
                                }
                            }

                            console.log("-----------------------------------------------------------------");
                            console.log("name : -- " + name + " --");
                            console.log("date : -- " + date + " --");
                            console.log("quesTitle : -- " + quesTitle + " --");
                            console.log("quesDetails : -- " + quesDetails + " --");
                            console.log("tags : -- " + tags + " --");
                            console.log("link : -- " + link + " --");
                            console.log("-----------------------------------------------------------------");
                            console.log();

                            var fetchedTempData = { name, date, quesTitle, quesDetails, tags, link };
                            fetchedData.push(fetchedTempData);
                            tempRes.push(fetchedTempData);

                            // });
                        }
                        console.log("-----------------------------------------------------------------");
                        console.log('Run no : ' + urlsInd + ' at ' + url.name + ' completed');
                        console.log("Total Results: -- " + fetchedData.length + " --");
                        console.log("-----------------------------------------------------------------");
                        console.log();
                        // nightmare.end()
                        // resolve(fetchedData);
                        // return fetchedData;
                        return nightmare.end();
                    })
                // nightmare.end();
                // console.log(tempRes);
                return tempRes;

            } catch (error) {
                console.log('Error in nightmare-scrap.js');
                console.log(error);
                reject('Could NOT Scrap');
                return nightmare.end();
            }
        }
    }

    // if (true) {
    //   resolve("Stuff worked!");
    // }
    // else {
    //   reject(Error("It broke"));
    // }
});

function extractDate(data1) {
    // var data1 = item.children[0].data;

    data1 = data1.split("\n");

    var patt = /\w{3,9}?\s\d{1,2}?,\s\d{4}?/;
    date = patt.exec(data1[2]);
    if (date !== null) {
        date = date[0];
        var pattern = "at";
        date += " " + data1[2].substr(data1[2].indexOf(pattern) + pattern.length + 1, data1[2].length).trim();
    } else {
        var ind = data1[2].indexOf('h ago');
        if (ind == -1) {
            var mInd = data1[2].indexOf('m ago');
            if (mInd == -1) {
                date = today;
            } else {
                var mins;
                if ((mInd - 2) > -1) {
                    mins = data1[2].substr(mInd - 2, mInd).trim();
                } else {
                    mins = data1[2].substr(mInd - 1, mInd).trim();
                }

                mins = parseInt(mins);
                // console.log(mins + " mins");
                date = moment().subtract(mins, 'minutes').format("MMMM D, YYYY h:mm A");
            }

        } else {
            var hours;
            if ((ind - 2) > -1) {
                hours = data1[2].substr(ind - 2, ind).trim();
            } else {
                hours = data1[2].substr(ind - 1, ind).trim();
            }
            // var hours = data1[2].substr(ind - 2, ind).trim();
            // hours = parseInt(hours);
            hours = parseInt(hours);
            // console.log(hours + " hours");
            date = moment().subtract(hours, 'hours').format("MMMM D, YYYY h:mm A");
        }

        // date.setHours(today.getHours() - hours);
    }

    // August 8, 2018 11:44 AM
    return date;
}

function postExists2(nightmare, ind, inputCount, itemsArray) {
    var classPath = 'ul.compactFeedList > li:nth-child(' + ind + ')';
    // var classPath = `.cuf-feed > .cuf-feedElementIterationItem:nth-child(${ind}) > .cuf-element > article.cuf-feedItem`;
    var articlePath = `article.cuf-feedItem`;
    // console.log(classPath);
    return nightmare
        .wait(".slds-input.slds-combobox__input")
        .click(".slds-input.slds-combobox__input")
        .wait("lightning-base-combobox-item:nth-of-type(2)")
        .click("lightning-base-combobox-item:nth-of-type(2)")
        .wait("ul.compactFeedList > li:nth-child(1)")
        .exists("ul.compactFeedList > li:nth-child(1)")
        .wait('ul.compactFeedList > li:nth-child(' + 1 + ')')
        .exists(classPath) //again this will return a boolean so we can check if the button exists
        .then(function (result) {
            if (result) {
                console.log("-----------------------------------------------------------------");
                console.log('Post ' + ind + ' Exists');
                return nightmare
                    .wait('ul.compactFeedList > li:nth-child(' + ind + ') a')
                    .click('ul.compactFeedList > li:nth-child(' + ind + ') a')
                    .wait(articlePath)
                    .then(function (res) {
                        // console.log('articlePath res = ' + res + ' END');

                        return nightmare
                            .exists(articlePath + " .moreLabel")
                            .then(function (res) {
                                if (res) {
                                    console.log("Show More Tags found for Post " + ind);
                                    nightmare
                                        .click(articlePath + " .moreLabel")
                                        .then(function (res) { })
                                    return nightmare
                                        .exists(articlePath + " a.cuf-more")
                                        .then(function (res) {
                                            if (res) {
                                                console.log("More Post Content found for Post " + ind);
                                                nightmare.click(articlePath + " .cuf-more")
                                            }
                                            return true;
                                        })
                                }
                                return true;
                            })
                    })
                    .then(function (res) {
                        // console.log("More Labels expanded : " + res);
                        return nightmare
                            .wait(articlePath)
                            .evaluate((ind) => {
                                // elements = Array.prototype.slice.call(document.querySelector(cP));
                                // var element = document.querySelector(cP);
                                // console.log('parameter passed is ---+' + ind + '+---');
                                var tempInd = ind;
                                var element = document.querySelector('article.cuf-feedItem');
                                if (element == null) {
                                    return { error: "Element NULL" };
                                } else {
                                    return {
                                        href: "https://basecamp.kony.com/s/question/" + element.dataset.id,
                                        children: (Array.prototype.slice.call(element.children))
                                            .map(function (child) { return { data: child.innerText } }),
                                    };
                                }

                            }, ind)
                            .then((item) => {
                                nightmare.back();
                                if (!item) {
                                    console.log("False item " + JSON.stringify(item));
                                    return postExists2(nightmare, ind, inputCount + 1, itemsArray);
                                }
                                console.log("item " + JSON.stringify(item));
                                console.log("-----------------------------------------------------------------");
                                console.log();
                                var data1 = item.children[0].data;

                                var d1 = Date.parse(extractDate(data1));
                                var d2 = Date.parse(lastDate);

                                if (d1 > d2) {
                                    itemsArray.push(item);
                                    return postExists2(nightmare, ind + 1, inputCount + 1, itemsArray);
                                }
                                else {
                                    return itemsArray;
                                }
                            });
                    })

                // nightmare.click('.cuf-showMore') //click it again so we can keep moving through the confirmations
                // return okStillExists(nightmare) //and finally run the function again since it's still here
            } else {
                var returnValue;
                // console.log('Post '+ind+' Does NOT Exist')
                return nightmare
                    .exists('.cuf-showMore')
                    .then(function (res) {
                        if (res) {
                            // console.log("View More Button Exists");
                            nightmare.click('.cuf-showMore');
                            // console.log("View More Button Clicked");
                            return postExists2(nightmare, ind, inputCount, itemsArray);
                        }
                        else {
                            // console.log("View More Button NOT FOUND");
                            // return "View More Does NOT Exist";
                            return itemsArray
                        }
                    });

                // return false;
            }

        })
}

module.exports = promise;
