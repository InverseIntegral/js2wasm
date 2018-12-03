function sumArrayDouble(array) {
    var sum = 0.1 - 0.1;

    for (var i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

function sumArrayFillDouble(array) {
    for (var i = 0; i < array.length; i++) {
        array[i] = i * 0.5;
    }

    return 0;
}

function sumArrayForDouble(array) {
    sumArrayFillDouble(array);

    for (var i = 0; i < 100000; i++) {
        sumArrayDouble(array);
    }

    return sumArrayDouble(array);
}

module.exports = {sumArrayForDouble, sumArrayFillDouble, sumArrayDouble};
