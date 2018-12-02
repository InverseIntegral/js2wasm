function quickSortSwapInteger(items, first, second) {
    var temp = items[first];
    items[first] = items[second];
    items[second] = temp;

    return 0;
}

function quickSortPartitionInteger(items, left, right) {
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
            quickSortSwapInteger(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function quickSortInteger(items, left, right) {
    if (items.length <= 1) {
        return items;
    }

    var index = quickSortPartitionInteger(items, left, right);

    if (left < index - 1) {
        quickSortInteger(items, left, index - 1);
    }

    if (index < right) {
        quickSortInteger(items, index, right);
    }

    return items;
}

function quickSortFillInteger(array) {
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

function quickSortIsSortedInteger(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function quickSortWhileInteger(items) {
    var i = 0;

    while (i < 100) {
        quickSortFillInteger(items);
        quickSortInteger(items, 0, items.length - 1);

        if (!quickSortIsSortedInteger(items)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {quickSortIsSortedInteger, quickSortFillInteger, quickSortInteger, quickSortPartitionInteger, quickSortWhileInteger, quickSortSwapInteger};
