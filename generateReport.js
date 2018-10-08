const ChartjsNode = require('chartjs-node');
var config = require('./config');
var statsHelper = require('./helpers/stats');
var fs = require('fs');
var _ = require('lodash');
var PNG = require('pngjs').PNG;
var noOfCalls = 0;

var collectionLoc = config.folders.dataDir + config.folders.jiraColLoc;
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

console.log(priStats);

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

function getColorsArray(statsArr) {
    var colorsArray = [];
    for(var i = 0; i < statsArr.length; i++){
        colorsArray.push(getRandomColor());
    }
    return colorsArray;
}

function getRandomColor() {
    var r = Math.floor(Math.random() * 256),
        g = Math.floor(Math.random() * 256),
        b = Math.floor(Math.random() * 256);

    return `rgba(${r}, ${g}, ${b}, 1)`;
}

function generatecolumnChartOptions(statsArr, chartTitle){
    var columnChartOptions = {
        type: 'bar',
        data: {
            labels: statsArr[0],
            datasets: [{
                label: '# of Bugs',
                data: statsArr[1],
                backgroundColor: getRandomColor(),
            }]
        },
        options: {
            title: {
                display: true,
                text: chartTitle
            },
            legend: {
                display: true,
                labels: {
                    fontColor: 'rgb(0, 0, 0)'
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 10
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true,
                        max: Math.max(...statsArr[1]) * 1,
                    }
                }]
            }
        }
    }
    return columnChartOptions;
}


var pieChartOptions = {
    type: 'doughnut',
    data: {
        labels: priStats[0],
        datasets: [{
            data: priStats[1],
            backgroundColor: getColorsArray(priStats[0]),
        }]
    },
    options: {
        
    }
}

var polarAreaChartOptions = {
    type: 'polarArea',
    data: {
        labels: priStats[0],
        datasets: [{
            data: priStats[1],
            backgroundColor: getColorsArray(priStats[0]),
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
}

generateChart(generatecolumnChartOptions(priStats, 'Primary Keyword Stats'), 1280, 720, './data/testimage.png')
.then((res) => {
    console.log(res);
});
generateChart(generatecolumnChartOptions(secStats, 'Secondary Keyword Stats'), 1280, 720, './data/testimage2.png')
.then((res) => {
    console.log(res);
});

// generateChart(pieChartOptions, 1280, 720, 'testimage2.png');
// generateChart(polarAreaChartOptions, 1280, 720, 'testimage3.png');

function generateChart(chartOptions, width, height, imgPath) {
    // canvas size
var chartNode = new ChartjsNode(width, height);
// console.log(chartNode)
return new Promise((resolve, reject) => {
    chartNode.drawChart(chartOptions)
.then(function() {
    var chartInstance = chartNode._chart;
    // console.log(chartInstance);
    var ctx = chartInstance.ctx;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    chartOptions.data.datasets.forEach(function(dataset, i) {
        var meta = chartInstance.controller.getDatasetMeta(i);
        meta.data.forEach(function(bar, index) {
        var data = dataset.data[index];
        ctx.fillText(data, bar._model.x, bar._model.y - 5);
        });
    });

    // write to a file
    chartNode.writeImageToFile('image/png', imgPath)
        .then(()=>{
            // console.log('Ho gaya');
            fs.createReadStream(imgPath)
            .pipe(new PNG({
                colorType: 2,
                bgColor: {
                    red: 255,
                    green: 255,
                    blue: 255
                }
            }))
            .on('parsed', function() {
                this.pack().pipe(fs.createWriteStream(imgPath));
                console.log('Written to file')
                // return 'DONE';
                resolve(++noOfCalls);
            });
        });
    })
})

}




 
