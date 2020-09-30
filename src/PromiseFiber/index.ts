export class PromiseFiber<ResolveT = any, ErrorT = any> {
    public promise: Promise<ResolveT>;
    public resolve: (data?: ResolveT) => void;
    public reject: (data?: ResolveT) => void;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    public await(): Promise<ResolveT> {
        return this.promise;
    }
}
