function swap(items, first, second) {
    var temp = items[first];
    items[first] = items[second];
    items[second] = temp;

    return 0;
}

function partition(items, left, right) {
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

module.exports = {quickSort, partition, swap};
