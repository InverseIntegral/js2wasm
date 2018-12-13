#include <iostream>
#include <chrono>

double newtonsMethod(int iterations, double initial) {
    int i = 0;

    while (i < iterations) {
        initial = initial - (initial * initial - 612) / (2 * initial);
        i++;
    }

    return initial;
}

double newtonsMethodWhile(int iterations, double initial) {
    int i = 0;

    while (i < 10000000) {
        newtonsMethod(iterations, initial);
        i++;
    }

    return newtonsMethod(iterations, initial);
}

int main() {
    auto start = std::chrono::high_resolution_clock::now();
    auto result = newtonsMethodWhile(200, 32.1);
    auto end = std::chrono::high_resolution_clock::now();

    std::cout << "Elapsed Milliseconds: " << std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count() << std::endl;
    std::cout << "Expected result: " << 24.73863375370596 << std::endl;
    std::cout << "Actual result: " << result << std::endl;
    return 0;
}
