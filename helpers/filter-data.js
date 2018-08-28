var filterData = function(result,hidKeywords,priKeywords,secKeywords){
    var filteredResult = [];
    for(var i = 0; i < result.length; i++){
        var quesTitle = result[i].quesTitle;
        var quesDetails = result[i].quesDetails;
        
        result[i].hidList = [];
        result[i].priList = [];
        result[i].secList = [];

        var list0 = hidKeywords.length > 0;
        var list1 = priKeywords.length > 0;
        var list2 = secKeywords.length > 0;

        for(var j = 0; j < hidKeywords.length; j++){
            var tempString = hidKeywords[j].trim();
            var re = new RegExp(tempString, "gi");
            count = 0;
            count += (quesTitle.match(re) || []).length;
            count += (quesDetails.match(re) || []).length;
            if(count > 0){
                // console.log("Match Found");
                result[i].hidList.push({
                    keyword: tempString,
                    count: count
                });
            }
        }

        // if(result[i].hidList.length == 0) {
        //     continue;
        // }

        for(var j = 0; j < priKeywords.length; j++){
            var tempString = priKeywords[j].trim();
            var re = new RegExp(tempString, "gi");
            count = 0;
            count += (quesTitle.match(re) || []).length;
            count += (quesDetails.match(re) || []).length;
            if(count > 0){
                // console.log("Match Found");
                result[i].priList.push({
                    keyword: tempString,
                    count: count
                });
            }
        }

        for(var j = 0; j < secKeywords.length; j++){

            var re = new RegExp(secKeywords[j], "gi");
            count = 0;
            count += (quesTitle.match(re) || []).length;
            count += (quesDetails.match(re) || []).length;
            if(count > 0){
                // console.log("Match Found");
                result[i].secList.push({
                    keyword: secKeywords[j],
                    count: count
                });
            }
        }

        if(list1 && list2){
            if(result[i].priList.length > 0 && result[i].secList.length > 0){
                filteredResult.push(result[i]);
            }   
        }
        else{
            if(list1){
                if(result[i].priList.length > 0){
                    filteredResult.push(result[i]);
                }
            }
            if(list2){
                if(result[i].secList.length > 0){
                    filteredResult.push(result[i]);
                }                     
            }
        }
    }

    result = filteredResult;
    console.log(result.length + " in filter-data.js");
    
    return result;

}

module.exports = filterData;