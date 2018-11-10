function quickSortSwap(items, first, second) {
    var temp = items[first];
    items[first] = items[second];
    items[second] = temp;

    return 0;
}

function quickSortPartition(items, left, right) {
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
            quickSortSwap(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function quickSort(items, left, right) {
    if (items.length <= 1) {
        return items;
    }

    var index = quickSortPartition(items, left, right);

    if (left < index - 1) {
        quickSort(items, left, index - 1);
    }

    if (index < right) {
        quickSort(items, index, right);
    }

    return items;
}

// LCG with GCCs parameters
function quickSortFill(array) {
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

function quickSortIsSorted(array) {
    var i = 0;

    while (i < array.length - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

function quickSortWhile(items) {
    var i = 0;

    while (i < 100) {
        quickSortFill(items);
        quickSort(items, 0, items.length - 1);

        if (!quickSortIsSorted(items)) {
            return false;
        }

        i++;
    }

    return true;
}

module.exports = {quickSortIsSorted, quickSortFill, quickSort, quickSortPartition, quickSortWhile, quickSortSwap};
