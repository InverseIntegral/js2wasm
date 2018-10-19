function swap(items, first, second) {
    var temp = items[first];
    items[first] = items[second];
    items[second] = temp;
}

function partition(items, left, right) {
    var pivot = items[Math.floor((right + left) / 2)];
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
            swap(items, i, j);
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

    var index = partition(items, left, right);

    if (left < index - 1) {
        quickSort(items, left, index - 1);
    }

    if (index < right) {
        quickSort(items, index, right);
    }

    return items;
}

function run() {
    let size = 10000;
    quickSort([...Array(size).keys()].reverse(), 0, size);
}

module.exports = run;
