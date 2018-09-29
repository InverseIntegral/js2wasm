function sum() {
    var sum = 0;

    for (var i = 1; i < 100000; i++) {
        sum += i;
    }

    return sum;
}

console.log(sum());
