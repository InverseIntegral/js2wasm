function sum() {
    var sum = 0;
    var i = 1;

    while (i < 65535) {
        sum += i;
        i++;
    }

    return sum;
}

module.exports = sum;
