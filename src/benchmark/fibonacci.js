function fibonacci(current) {
    if (current <= 2) {
        return 1;
    }

    return fibonacci(current - 2) + fibonacci(current - 1);
}
