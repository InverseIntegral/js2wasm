#include <iostream>
#include <chrono>

int gcd(int a, int b) {
    while (b != 0) {
        if (a > b) {
            a -= b;
        } else {
            b -= a;
        }
    }

    return a;
}

int gcdWhile(int a, int b) {
    int i = 0;

    while (i < 10000) {
        gcd(a, b);
        i++;
    }

    return gcd(a, b);
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    auto gcd = gcdWhile(978, 2147483646);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << 6 << std::endl;
    std::cout << "Actual result: " << gcd << std::endl;
    return 0;
}