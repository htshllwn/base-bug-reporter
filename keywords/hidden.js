var arrayCleaner = require('../helpers/array-cleaner');

hiddenWords = [
    "MarketPlace ",
    "Component",
]

module.exports = arrayCleaner(hiddenWords);