#include <iostream>
#include <chrono>

bool isPrime(int number) {
    if (number <= 2) {
        return false;
    }

    for (int factor = 2; factor * factor <= number; factor++) {
        if (number % factor == 0) {
            return false;
        }
    }

    return true;
}

int countPrimes() {
    int count = 0;

    for (int i = 0; i < 20000000; i++) {
        if (isPrime(i)) {
            count++;
        }
    }

    return count;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    auto result = countPrimes();
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << 1270606 << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}