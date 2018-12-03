function mergeSortCopyArrayDouble(destination, source, fromIndex, toIndex) {
    var i = fromIndex;

    while (i < toIndex) {
        destination[i] = source[i];
        i++;
    }

    return destination;
}

function mergeSortDouble(array, workspaceArray, left, right) {
    if (right - left == 1) {
        return workspaceArray;
    }

    var middle = (left + right) / 2;
    mergeSortDouble(array, workspaceArray, left, middle);
    mergeSortDouble(array, workspaceArray, middle, right);

    mergeSortMergeDouble(array, workspaceArray, left, middle, right);

    return workspaceArray;
}

function mergeSortMergeDouble(array, workspaceArray, left, middle, right) {
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

    mergeSortCopyArrayDouble(array, workspaceArray, left, right);
    return workspaceArray;
}

function mergeSortIsSortedDouble(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function mergeSortFillDouble(array) {
    var i = 0;

    var current = 0.5;
    var state = false;

    while (i < array.length) {
        array[i] = current;

        current *= -1;

        if (state) {
            current += 0.5;
        }

        state = !state;
        i++;
    }

    return 0;
}

function mergeSortWhileDouble(array, workspaceArray) {
    var i = 0;

    while (i < 100) {
        mergeSortFillDouble(array);
        mergeSortDouble(array, workspaceArray, 0, array.length);

        if (!mergeSortIsSortedDouble(array)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {mergeSortWhileDouble, mergeSortFillDouble, mergeSortIsSortedDouble, mergeSortMergeDouble, mergeSortDouble, mergeSortCopyArrayDouble};