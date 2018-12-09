#include <iostream>
#include <chrono>

bool isPrime(int number) {
    if (number <= 2) {
        return false;
    }

    for (auto factor = 2; factor * factor <= number; factor++) {
        if (number % factor == 0) {
            return false;
        }
    }

    return true;
}

int countPrimes() {
    auto count = 0;

    for (auto i = 0; i < 20000000; i++) {
        if (isPrime(i)) {
            count++;
        }
    }

    return count;
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    auto primes = countPrimes();
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Primes expected: " << 1270606 << std::endl;
    std::cout << "Primes counted: " << primes << std::endl;
    return 0;
}