function sumArrayInteger(array) {
    var sum = 0;

    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

function sumArrayFillInteger(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = i;
    }

    return 0;
}

function sumArrayForInteger(array) {
    sumArrayFillInteger(array);

    for (var i = 0; i < 100000; i++) {
        sumArrayInteger(array);
    }

    return sumArrayInteger(array);
}

module.exports = {sumArrayForInteger, sumArrayFillInteger, sumArrayInteger};
