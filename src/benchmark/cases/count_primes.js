function isPrime(number) {
    if (number <= 2) {
        return false;
    }

    for (var factor = 2; factor * factor <= number; factor++) {
        if (number % factor == 0) {
            return false;
        }
    }

    return true;
}

function countPrimes() {
    var count = 0;

    for (var i = 0; i < 20000000; i++) {
        if (isPrime(i)) {
            count++;
        }
    }

    return count;
}

module.exports = {isPrime, countPrimes};