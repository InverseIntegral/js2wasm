function fibonacci(current) {
    if (current <= 2) {
        return 1;
    }

    return fibonacci(current - 2) + fibonacci(current - 1);
}

function fibonacciWhile(current) {
    var i = 0;

    while (i < 10) {
        fibonacci(current);
        i++;
    }

    return fibonacci(current);
}

module.exports = {fibonacciWhile, fibonacci};
