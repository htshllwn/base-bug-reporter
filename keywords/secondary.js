var arrayCleaner = require('../helpers/array-cleaner');

secondaryWords = [
    "Hang",
    "Crash",
    "Bug",
    "Not working",
    "Not responding",
    "Not behaving",
    "Weird",
    "Unexpected behaviour",
    " fail",
    " failure ",
    "error"
];

module.exports = arrayCleaner(secondaryWords);