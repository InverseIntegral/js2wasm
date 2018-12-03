function quickSortSwapDouble(items, first, second) {
    var temp = items[first];
    items[first] = items[second];
    items[second] = temp;

    return 0;
}

function quickSortPartitionDouble(items, left, right) {
    var pivot = items[left];
    var i = left;
    var j = right;

    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }

        while (items[j] > pivot) {
            j--;
        }

        if (i <= j) {
            quickSortSwapDouble(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function quickSortDouble(items, left, right) {
    if (items.length <= 1) {
        return items;
    }

    var index = quickSortPartitionDouble(items, left, right);

    if (left < index - 1) {
        quickSortDouble(items, left, index - 1);
    }

    if (index < right) {
        quickSortDouble(items, index, right);
    }

    return items;
}

function quickSortFillDouble(array) {
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

function quickSortIsSortedDouble(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function quickSortWhileDouble(items) {
    var i = 0;

    while (i < 100) {
        quickSortFillDouble(items);
        quickSortDouble(items, 0, items.length - 1);

        if (!quickSortIsSortedDouble(items)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {quickSortIsSortedDouble, quickSortFillDouble, quickSortDouble, quickSortPartitionDouble, quickSortWhileDouble, quickSortSwapDouble};
