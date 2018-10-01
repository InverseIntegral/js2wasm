function sum() {
    var sum = 0;
    var i = 0.0001;

    while (i < 100) {
        sum += i;
        i += 0.00001;
    }

    return sum;
}

module.exports = sum;
