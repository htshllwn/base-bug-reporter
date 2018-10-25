var path = require('path');
var CWD = process.cwd();
var fs = require('fs');

var arrayCleaner = require(path.join(CWD, 'helpers', 'array-cleaner'));

var keywordsFileName = 'keywords.json';
var keywordsFileData = fs.readFileSync(path.join(CWD, 'keywords', keywordsFileName));

var keywords = JSON.parse(keywordsFileData);

var exportKeywords = {
    hidden: arrayCleaner(keywords.hidden),
    primary: arrayCleaner(keywords.primary),
    secondary: arrayCleaner(keywords.secondary),
    queries: arrayCleaner(keywords.queries)
};

module.exports = exportKeywords;