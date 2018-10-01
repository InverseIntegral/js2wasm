function F(x) {
    return Math.pow(x, 2) - 612; // solve x^2 = 612
}

function f(x) {
    return 2 * x;
}

function solve(iterations, initial) {
    var i = 0;

    while (i < iterations) {
        initial = initial - F(initial) / f(initial);
        i++;
    }

    return initial;
}
