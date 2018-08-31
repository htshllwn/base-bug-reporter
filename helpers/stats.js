

var getStats = function(newQuestions) {
    var stats1;
    var stats2;

    var tempData1 = [];
    var tempData2 = [];
    var tempData3 = [];
    var tempData4 = [];
    for(var x = 0; x < newQuestions.length; x++){
        
        if(newQuestions[x].priList){
            for(var y = 0; y < newQuestions[x].priList.length; y++){
                var tempInd = tempData1.indexOf(newQuestions[x].priList[y].keyword);
                if(tempInd > -1){
                    tempData2[tempInd] += 1;
                } else {
                    tempData1.push(newQuestions[x].priList[y].keyword);
                    tempData2.push(1);
                    // console.log(tempData1);
                    // console.log(tempData2);
                }
            }
            stats1 = [tempData1, tempData2];
            // stats1 = tempData;
        }
        if(newQuestions[x].secList){
            for(var y = 0; y < newQuestions[x].secList.length; y++){
                var tempObj = {};
                var tempInd = tempData3.indexOf(newQuestions[x].secList[y].keyword);
                if(tempInd > -1){
                    tempData4[tempInd] += 1;
                } else {
                    tempData3.push(newQuestions[x].secList[y].keyword);
                    tempData4.push(1);
                }
            }
            stats2 = [tempData3, tempData4];
        }
    }
    return {
        priStats: stats1,
        secStats: stats2
    }
}

module.exports = {
    getStats: getStats
}


