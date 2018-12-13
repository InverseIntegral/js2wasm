#include <iostream>
#include <chrono>
#include <vector>

int sumArrayInteger(std::vector<int> & array) {
    int sum = 0;

    for (int i = 0; i < array.size(); i++) {
        sum += array[i];
    }

    return sum;
}

int sumArrayFillInteger(std::vector<int> & array) {
    for (int i = 0; i < array.size(); i++) {
        array[i] = i;
    }

    return 0;
}

int sumArrayForInteger(std::vector<int> & array) {
    sumArrayFillInteger(array);

    for (int i = 0; i < 100000; i++) {
        sumArrayInteger(array);
    }

    return sumArrayInteger(array);
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<int> array(65535);
    auto result = sumArrayForInteger(array);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << 2147385345 << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}
