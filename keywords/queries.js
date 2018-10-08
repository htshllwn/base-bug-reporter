var arrayCleaner = require('../helpers/array-cleaner');

queryWords = [
    "Retail",
    "Shopping",
    "Field Services",
    "Micro Apps",
    "Want",
    "Can you",
    "Limitation",
    "Restriction",
    "Drawback",
    "Modification",
    "Support",
    "Extend",
    "Help",
    "Difficult",
    "Frustration",
    "Trouble",
    "missing",
    "competitor",
    "OutSystems",
    "React Native",
];

module.exports = arrayCleaner(queryWords);