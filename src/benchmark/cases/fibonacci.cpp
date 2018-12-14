#include <iostream>
#include <chrono>

int fibonacci(int current) {
    if (current <= 2) {
        return 1;
    }

    return fibonacci(current - 2) + fibonacci(current - 1);
}

int fibonacciWhile(int current) {
    int i = 0;

    while (i < 10) {
        fibonacci(current);
        i++;
    }

    return fibonacci(current);
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    auto result = fibonacciWhile(41);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << 165580141 << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}