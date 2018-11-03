function mergeSortCopyArray(destination, source, fromIndex, toIndex) {
    var i = fromIndex;

    while (i < toIndex) {
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

    mergeSortMerge(array, workspaceArray, left, middle, right);

    return workspaceArray;
}

function mergeSortMerge(array, workspaceArray, left, middle, right) {
    var leftIndex = left;
    var rightIndex = middle;
    var index = left;

    while (leftIndex < middle && rightIndex < right) {
        if (array[leftIndex] < array[rightIndex]) {
            workspaceArray[index] = array[leftIndex];
            leftIndex++;
        } else {
            workspaceArray[index] = array[rightIndex];
            rightIndex++;
        }

        index++;
    }

    while (leftIndex < middle) {
        workspaceArray[index] = array[leftIndex];
        leftIndex++;
        index++;
    }

    while (rightIndex < right) {
        workspaceArray[index] = array[rightIndex];
        rightIndex++;
        index++;
    }

    mergeSortCopyArray(array, workspaceArray, left, right);
    return workspaceArray;
}

function mergeSortIsSorted(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function mergeSortFill(array) {
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
        mergeSortFill(array);
        mergeSort(array, workspaceArray, 0, array.length);

        if (!mergeSortIsSorted(array)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {mergeSortWhile, mergeSortFill, mergeSortIsSorted, mergeSortMerge, mergeSort, mergeSortCopyArray};