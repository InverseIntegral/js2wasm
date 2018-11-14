function sumArray(array) {
    var sum = 0;

    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

function sumArrayFill(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = i;
    }

    return 0;
}

function sumArrayFor(array) {
    sumArrayFill(array);

    for (var i = 0; i < 100000; i++) {
        sumArray(array);
    }

    return sumArray(array);
}

module.exports = {sumArrayFor, sumArrayFill, sumArray};
