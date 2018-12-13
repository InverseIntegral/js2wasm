#include <iostream>
#include <chrono>
#include <vector>

double sumArrayDouble(std::vector<double> & array) {
    double sum = 0.1 - 0.1;

    for (int i = 0; i < array.size(); i++) {
        sum += array[i];
    }

    return sum;
}

int sumArrayFillDouble(std::vector<double> & array) {
    for (int i = 0; i < array.size(); i++) {
        array[i] = i * 0.5;
    }

    return 0;
}

double sumArrayForDouble(std::vector<double> & array) {
    sumArrayFillDouble(array);

    for (int i = 0; i < 100000; i++) {
        sumArrayDouble(array);
    }

    return sumArrayDouble(array);
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    std::vector<double> array(65535);
    auto result = sumArrayForDouble(array);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << 1073692672.5 << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}
