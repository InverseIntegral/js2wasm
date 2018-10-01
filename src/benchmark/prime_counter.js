function isPrime(toTest) {
    if (toTest === 1 || toTest === 0) {
        return false;
    }

    var i = 2;
    var s = Math.sqrt(toTest);

    for (; i <= s; i++) {
        if (toTest % i === 0) {
            return false;
        }
    }

    return true;
}

function countPrimes(max) {
    var counter = 0;
    var i = 2;

    for (; i < max; i++) {
        if (isPrime(i)) {
            counter++;
        }
    }

    return counter;
}
