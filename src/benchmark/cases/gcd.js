function gcd(a, b) {
    while (b != 0) {
        if (a > b) {
            a = a - b;
        } else {
            b = b - a;
        }
    }

    return a;
}

function gcdWhile(a, b) {
    var i = 0;

    while (i < 10000) {
        gcd(a, b);
        i++;
    }

    return gcd(a, b);
}

module.exports = {gcd, gcdWhile};