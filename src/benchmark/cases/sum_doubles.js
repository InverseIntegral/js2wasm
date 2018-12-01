function sumDoubles(sum) {
    var i = 0.0001;

    while (i < 100) {
        sum += i;
        i += 0.00001;
    }

    return sum;
}

function sumDoublesWhile() {
    var i = 0;

    while (i < 1000) {
        sumDoubles(0);
        i++;
    }

    return sumDoubles(0);
}

module.exports = {sumDoubles, sumDoublesWhile};
