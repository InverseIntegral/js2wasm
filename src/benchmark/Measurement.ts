class Measurement {

    private readonly warmupRounds: number;
    private readonly measureRounds: number;

    constructor(warmupRounds: number, measureRounds: number) {
        this.warmupRounds = warmupRounds;
        this.measureRounds = measureRounds;
    }

    public executeMeasurement(jsAlgorithm: () => void): [number, number] {
        this.executeAlgorithm(jsAlgorithm, this.warmupRounds);
        const jsTime: number = this.measureTime(jsAlgorithm);

        // cross compile here
        const wasmAlgorithm: () => void = jsAlgorithm; // change to cross compiled function
        this.executeAlgorithm(wasmAlgorithm, this.warmupRounds);
        const wasmTime: number = this.measureTime(wasmAlgorithm);

        return [jsTime, wasmTime];
    }

    private measureTime(algorithm: () => void): number {
        const startTime: number = Date.now();
        this.executeAlgorithm(algorithm, this.measureRounds);
        const endTime: number = Date.now();
        return endTime - startTime;
    }

    private executeAlgorithm(algorithm: () => void, rounds: number): void {
        for (let i = 0; i < rounds; i++) {
            algorithm();
        }
    }
}

export default Measurement;
