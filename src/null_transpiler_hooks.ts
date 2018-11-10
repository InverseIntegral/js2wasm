import TranspilerHooks from './transpiler_hooks';

class NullTranspilerHooks implements TranspilerHooks {

    public beforeCompilation() {}

    public afterCompilation() {}

    public beforeExecution() {}

    public afterExecution() {}

    public beforeExport() {}

    public afterExport() {}

    public beforeImport() {}

    public afterImport() {}

}

export default NullTranspilerHooks;
