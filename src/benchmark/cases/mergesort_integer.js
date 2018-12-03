function mergeSortCopyArrayInteger(destination, source, fromIndex, toIndex) {
    var i = fromIndex;

    while (i < toIndex) {
        destination[i] = source[i];
        i++;
    }

    return destination;
}

function mergeSortInteger(array, workspaceArray, left, right) {
    if (right - left == 1) {
        return workspaceArray;
    }

    var middle = (left + right) / 2;
    mergeSortInteger(array, workspaceArray, left, middle);
    mergeSortInteger(array, workspaceArray, middle, right);

    mergeSortMergeInteger(array, workspaceArray, left, middle, right);

    return workspaceArray;
}

function mergeSortMergeInteger(array, workspaceArray, left, middle, right) {
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

    mergeSortCopyArrayInteger(array, workspaceArray, left, right);
    return workspaceArray;
}

function mergeSortIsSortedInteger(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function mergeSortFillInteger(array) {
    var i = 0;

    var current = 1;
    var state = false;

    while (i < array.length) {
        array[i] = current;

        current *= -1;

        if (state) {
            current++;
        }

        state = !state;
        i++;
    }

    return 0;
}

function mergeSortWhileInteger(array, workspaceArray) {
    var i = 0;

    while (i < 100) {
        mergeSortFillInteger(array);
        mergeSortInteger(array, workspaceArray, 0, array.length);

        if (!mergeSortIsSortedInteger(array)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {mergeSortWhileInteger, mergeSortFillInteger, mergeSortIsSortedInteger, mergeSortMergeInteger, mergeSortInteger, mergeSortCopyArrayInteger};