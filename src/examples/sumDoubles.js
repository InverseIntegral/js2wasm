function sum() {
    var sum = 0;

    for (var i = 0.0001; i < 100; i += 0.00001) {
        sum += i;
    }

    return sum;
}
