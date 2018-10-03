function sum() {
    var sum = 0;
    var i = 1;

    while (i < 100000) {
        sum += i;
        i++;
    }

    return sum;
}

module.exports = sum;
