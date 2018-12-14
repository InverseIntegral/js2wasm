#include <iostream>
#include <chrono>
#include <vector>
#include <math.h>

int quickSortSwapInteger(std::vector<int> & items, int first, int second) {
    int temp = items[first];
    items[first] = items[second];
    items[second] = temp;

    return 0;
}

int quickSortPartitionInteger(std::vector<int> & items, int left, int right) {
    int pivot = items[left];
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
            quickSortSwapInteger(items, i, j);
            i++;
            j--;
        }
    }

    return i;
}

std::vector<int> & quickSortInteger(std::vector<int> & items, int left, int right) {
    if (items.size() <= 1) {
        return items;
    }

    int index = quickSortPartitionInteger(items, left, right);

    if (left < index - 1) {
        quickSortInteger(items, left, index - 1);
    }

    if (index < right) {
        quickSortInteger(items, index, right);
    }

    return items;
}

int quickSortFillInteger(std::vector<int> & array) {
    int i = 0;

    int current = 1;
    bool state = false;

    while (i < array.size()) {
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

bool quickSortIsSortedInteger(std::vector<int> & array) {
    int i = 0;

    while (i < array.size() - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

bool quickSortWhileInteger(std::vector<int> & items) {
    int i = 0;

    while (i < 100) {
        quickSortFillInteger(items);
        quickSortInteger(items, 0, items.size() - 1);

        if (!quickSortIsSortedInteger(items)) {
            return false;
        }

        i++;
    }

    return true;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<int> array(pow(2, 20));
    auto result = quickSortWhileInteger(array);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << true << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}
