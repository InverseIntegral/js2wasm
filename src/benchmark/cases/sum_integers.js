function sumIntegers() {
    var sum = 0;
    var i = 1;

    while (i < 65535) {
        sum += i;
        i++;
    }

    return sum;
}

function sumIntegersWhile() {
    var i = 0;

    while (i < 100000) {
        sumIntegers();
        i++;
    }

    return sumIntegers();
}

module.exports = {sumIntegers, sumIntegersWhile};
