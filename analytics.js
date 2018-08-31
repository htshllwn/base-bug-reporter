var path = require('path');
var config = require('./config');
var statsHelper = require('./helpers/stats');
var fs = require('fs');
var _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var port = 5000;
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

function formatStats(data){
    var tempList=  [];
    for(var x = 0; x < data[0].length; x++){
        var tempObj = {
            keyword: data[0][x],
            count: data[1][x]
        }
        tempList.push(tempObj);
    }
    return tempList;
}

app.get('/', (req, res) => {
    var collectionLoc = config.folders.dataDir + config.folders.collectionLoc;
    if(!fs.existsSync(collectionLoc)){
        collection = []
    } else {
        collection = JSON.parse(fs.readFileSync(collectionLoc));
    }
    var statsRes = statsHelper.getStats(collection);
    var priStats = statsRes.priStats;
    var secStats = statsRes.secStats;

    var priStatsMod = formatStats(priStats);
    var secStatsMod = formatStats(secStats);
    // console.log(collection);
    res.render('home',{
        priStats: priStatsMod,
        secStats: secStatsMod
    });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
})