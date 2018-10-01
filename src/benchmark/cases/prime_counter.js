function isPrime(toTest) {
    if (toTest === 1 || toTest === 0) {
        return false;
    }

    var i = 2;
    var s = Math.sqrt(toTest);

    while (i <= s) {
        if (toTest % i === 0) {
            return false;
        }

        i++;
    }

    return true;
}

function countPrimes(max) {
    var counter = 0;
    var i = 2;

    while (i < max) {
        if (isPrime(i)) {
            counter++;
        }

        i++;
    }

    return counter;
}