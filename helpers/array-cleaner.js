var arrayCleaner = function(arr) {
    arr = arr.map(Function.prototype.call, String.prototype.trim);
    arr = arr.filter(v => v!='');
    return arr;
}

module.exports = arrayCleaner;