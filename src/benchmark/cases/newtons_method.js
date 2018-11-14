function newtonsMethod(iterations, initial) {
    var i = 0;

    while (i < iterations) {
        initial = initial - (initial * initial - 612) / (2 * initial);
        i++;
    }

    return initial;
}

function newtonsMethodWhile(iterations, initial) {
    var i = 0;

    while (i < 10000000) {
        newtonsMethod(iterations, initial);
        i++;
    }

    return newtonsMethod(iterations, initial);
}

module.exports = {newtonsMethod, newtonsMethodWhile};
