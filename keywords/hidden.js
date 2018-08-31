var arrayCleaner = require('../helpers/array-cleaner');

hiddenWords = [
    "MarketPlace ",
    "market place",
    "market",
    "Component",
]

module.exports = arrayCleaner(hiddenWords);