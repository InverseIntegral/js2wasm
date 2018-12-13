#include <iostream>
#include <chrono>
#include <vector>
#include <math.h>

std::vector<double> & mergeSortCopyArrayDouble(std::vector<double> & destination, std::vector<double> & source, int fromIndex, int toIndex) {
    int i = fromIndex;

    while (i < toIndex) {
        destination[i] = source[i];
        i++;
    }

    return destination;
}

std::vector<double> & mergeSortMergeDouble(std::vector<double> & array, std::vector<double> & workspaceArray, int left, int middle, int right) {
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

    mergeSortCopyArrayDouble(array, workspaceArray, left, right);
    return workspaceArray;
}

std::vector<double> & mergeSortDouble(std::vector<double> & array, std::vector<double> & workspaceArray, int left, int right) {
    if (right - left == 1) {
        return workspaceArray;
    }

    int middle = (left + right) / 2;
    mergeSortDouble(array, workspaceArray, left, middle);
    mergeSortDouble(array, workspaceArray, middle, right);

    mergeSortMergeDouble(array, workspaceArray, left, middle, right);

    return workspaceArray;
}

bool mergeSortIsSortedDouble(std::vector<double> & array) {
    int i = 0;

    while (i < array.size() - 1) {
        if (array[i] > array[i + 1]) {
            return false;
        }

        i++;
    }

    return true;
}

int mergeSortFillDouble(std::vector<double> & array) {
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

bool mergeSortWhileDouble(std::vector<double> & array, std::vector<double> & workspaceArray) {
    auto i = 0;

    while (i < 100) {
        mergeSortFillDouble(array);
        mergeSortDouble(array, workspaceArray, 0, array.size());

        if (!mergeSortIsSortedDouble(array)) {
            return false;
        }

        i++;
    }

    return true;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<double> array(pow(2, 20));
    std::vector<double> workspaceArray(pow(2, 20));
    auto result = mergeSortWhileDouble(array, workspaceArray);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << true << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}