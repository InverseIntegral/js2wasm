function copyArray(destination, source, includingStartIndex, excludingEndIndex) {
    var i = includingStartIndex;

    while (i < excludingEndIndex) {
        destination[i] = source[i];
        i++;
    }

    return destination;
}

function mergeSort(array, workspaceArray, left, right) {
    if (right - left == 1) {
        return workspaceArray;
    }

    var middle = (left + right) / 2;
    mergeSort(array, workspaceArray, left, middle);
    mergeSort(array, workspaceArray, middle, right);

    merge(array, workspaceArray, left, middle, right);

    return workspaceArray;
}

function merge(array, workspaceArray, left, middle, right) {
    var indexLeft = left;
    var indexRight = middle;
    var index = left;

    while (indexLeft < middle && indexRight < right) {
        if (array[indexLeft] < array[indexRight]) {
            workspaceArray[index] = array[indexLeft];
            indexLeft++;
        } else {
            workspaceArray[index] = array[indexRight];
            indexRight++;
        }

        index++;
    }

    while (indexLeft < middle) {
        workspaceArray[index] = array[indexLeft];
        indexLeft++;
        index++;
    }

    while (indexRight < right) {
        workspaceArray[index] = array[indexRight];
        indexRight++;
        index++;
    }

    copyArray(array, workspaceArray, left, right);
    return workspaceArray;
}

function isSorted(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function fill(array) {
    var i = 0;

    var modulus = 0x80000000; // 2^31
    var multiplier = 1103515245;
    var increment = 12345;

    var state = 42;

    while (i < array.length) {
        state = (multiplier * state + increment) % modulus;
        array[i] = state;
        i++;
    }

    return 0;
}

function mergeSortWhile(array, workspaceArray) {
    var i = 0;

    while (i < 100) {
        fill(array);
        mergeSort(array, workspaceArray, 0, array.length);

        if (!isSorted(array)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {mergeSortWhile, fill, isSorted, merge, mergeSort, copyArray};