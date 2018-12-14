#include <iostream>
#include <chrono>
#include <vector>
#include <math.h>

std::vector<int> &  mergeSortCopyArrayInteger(std::vector<int> & destination, std::vector<int> & source, int fromIndex, int toIndex) {
    int i = fromIndex;

    while (i < toIndex) {
        destination[i] = source[i];
        i++;
    }

    return destination;
}

std::vector<int> &  mergeSortMergeInteger(std::vector<int> & array, std::vector<int> & workspaceArray, int left, int middle, int right) {
    int leftIndex = left;
    int rightIndex = middle;
    int index = left;

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

std::vector<int> &  mergeSortInteger(std::vector<int> & array, std::vector<int> & workspaceArray, int left, int right) {
    if (right - left == 1) {
        return workspaceArray;
    }

    int middle = (left + right) / 2;
    mergeSortInteger(array, workspaceArray, left, middle);
    mergeSortInteger(array, workspaceArray, middle, right);

    mergeSortMergeInteger(array, workspaceArray, left, middle, right);

    return workspaceArray;
}

bool mergeSortIsSortedInteger(std::vector<int> & array) {
    int i = 0;

    while (i < array.size() - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

int mergeSortFillInteger(std::vector<int> & array) {
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

bool mergeSortWhileInteger(std::vector<int> & array, std::vector<int> & workspaceArray) {
    int i = 0;

    while (i < 100) {
        mergeSortFillInteger(array);
        mergeSortInteger(array, workspaceArray, 0, array.size());

        if (!mergeSortIsSortedInteger(array)) {
            return false;
        }

        i++;
    }

    return true;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<int> array(pow(2, 20));
    std::vector<int> workspaceArray(pow(2, 20));
    auto result = mergeSortWhileInteger(array, workspaceArray);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << true << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}