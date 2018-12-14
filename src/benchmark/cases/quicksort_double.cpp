#include <iostream>
#include <chrono>
#include <vector>
#include <math.h>

int quickSortSwapDouble(std::vector<double> & items, int first, int second) {
    double temp = items[first];
    items[first] = items[second];
    items[second] = temp;

    return 0;
}

int quickSortPartitionDouble(std::vector<double> & items, int left, int right) {
    double pivot = items[left];
    int i = left;
    int j = right;

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

std::vector<double> & quickSortDouble(std::vector<double> & items, int left, int right) {
    if (items.size() <= 1) {
        return items;
    }

    int index = quickSortPartitionDouble(items, left, right);

    if (left < index - 1) {
        quickSortDouble(items, left, index - 1);
    }

    if (index < right) {
        quickSortDouble(items, index, right);
    }

    return items;
}

int quickSortFillDouble(std::vector<double> & array) {
    int i = 0;

    double current = 0.5;
    bool state = false;

    while (i < array.size()) {
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

bool quickSortIsSortedDouble(std::vector<double> & array) {
    int i = 0;

    while (i < array.size() - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

bool quickSortWhileDouble(std::vector<double> & items) {
    int i = 0;

    while (i < 100) {
        quickSortFillDouble(items);
        quickSortDouble(items, 0, items.size() - 1);

        if (!quickSortIsSortedDouble(items)) {
            return false;
        }

        i++;
    }

    return true;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<double> array(pow(2, 20));
    auto result = quickSortWhileDouble(array);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << true << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}
