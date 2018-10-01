class Measurement {

    constructor(warmupRounds, measureRounds) {
        this.warmupRounds = warmupRounds;
        this.measureRounds = measureRounds;
    }

    executeMeasurement(jsAlgorithm) {
        this.executeAlgorithm(jsAlgorithm, this.warmupRounds);
        let jsTime = this.measureTime(jsAlgorithm, this.measureRounds);

        // cross compile here
        let wasmAlgorithm = jsAlgorithm; // change to cross compiled function
        this.executeAlgorithm(wasmAlgorithm, this.warmupRounds);
        let wasmTime = this.measureTime(wasmAlgorithm, this.measureRounds);

        return {jsTime, wasmTime};
    }

    measureTime(algorithm) {
        let startTime = Date.now();
        this.executeAlgorithm(algorithm, this.measureRounds);
        let endTime = Date.now();
        return endTime - startTime;
    }

    executeAlgorithm(algorithm, rounds) {
        for (let i = 0; i < rounds; i++) {
            algorithm();
        }
    }
}

export default Measurement;