import Instance = WebAssembly.Instance;

class WasmInstance {

    private instance: Instance;

    public constructor(binary: Uint8Array) {
        this.instance = new WebAssembly.Instance(new WebAssembly.Module(binary), {});
    }

    public add(left: number, right: number): number {
        return this.instance.exports.add(left, right);
    }

    public get functions(): string {
        return Object.keys(this.instance.exports).sort().join(',');
    }

}

export default WasmInstance;
