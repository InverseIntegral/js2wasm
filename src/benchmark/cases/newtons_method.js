function newtonsMethod(iterations, initial) {
    var i = 0;

    while (i < iterations) {
        initial = initial - (initial * initial - 612) / (2 * initial);
        i++;
    }

    return initial;
}

module.exports = newtonsMethod;
