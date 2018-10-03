class Measurement {

    private readonly warmupRounds: number;
    private readonly measureRounds: number;

    constructor(warmupRounds: number, measureRounds: number) {
        this.warmupRounds = warmupRounds;
        this.measureRounds = measureRounds;
    }

    public measure(jsAlgorithm: () => void): [number[], number[]] {
        this.executeAlgorithm(jsAlgorithm, this.warmupRounds);
        const jsTimes = this.executeAlgorithm(jsAlgorithm, this.measureRounds);

        // cross compile here
        const wasmAlgorithm = jsAlgorithm; // change to cross compiled function
        this.executeAlgorithm(wasmAlgorithm, this.warmupRounds);
        const wasmTimes = this.executeAlgorithm(wasmAlgorithm, this.measureRounds);

        return [jsTimes, wasmTimes];
    }

    private executeAlgorithm(algorithm: () => void, rounds: number): number[] {
        const times: number[] = [];

        for (let i = 0; i < rounds; i++) {
            const startTime: number = Date.now();
            algorithm();
            const endTime: number = Date.now();
            times.push(endTime - startTime);
        }

        return times;
    }
}

export default Measurement;
