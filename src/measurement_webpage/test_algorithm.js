function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function test_algorithm() {
    await sleep(1000);
}

export default test_algorithm;