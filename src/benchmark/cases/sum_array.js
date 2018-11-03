function sumArray(array) {
    var sum = 0;
    var i = 0;

    while (i < array.length) {
        sum += array[i];
        i++;
    }

    return sum;
}

function sumArrayFill(array) {
    var i = 0;

    while (i < array.length) {
        array[i] = i;
        i++;
    }

    return 0;
}

function sumArrayWhile(array) {
    var i = 0;
    sumArrayFill(array);

    while (i < 100000) {
        sumArray(array);
        i++;
    }

    return sumArray(array);
}

module.exports = {sumArrayWhile, sumArrayFill, sumArray};
