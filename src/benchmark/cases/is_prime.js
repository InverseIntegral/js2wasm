function isPrime(toTest) {
    if (toTest == 1 || toTest == 0) {
        return false;
    }

    var i = 2;

    while (i * i <= toTest) {
        if (toTest % i == 0) {
            return false;
        }

        i++;
    }

    return true;
}

function isPrimeWhile(toTest) {
    var i = 0;

    while (i < 10000000) {
        isPrime(toTest);
        i++;
    }

    return isPrime(toTest);
}

module.exports = {isPrime, isPrimeWhile};