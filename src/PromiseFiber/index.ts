export enum EState {
    Pending = 0,
    Resolved = 1,
    Rejected = 2
}

export class PromiseFiber<ResolveT = any, RejectT = any> {
    public promise: Promise<ResolveT>;
    private _resolve: (data?: ResolveT) => void;
    private _reject: (data?: RejectT) => void;
    private _state: EState = EState.Pending;

    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }

    public await(): Promise<ResolveT> {
        return this.promise;
    }

    public resolve(data?: ResolveT): void {
        this._state = EState.Resolved;
        this._resolve(data);
    }
    
    public reject(data?: RejectT): void {
        this._state = EState.Rejected;
        this._reject(data);
    }

    public getState(): EState {
        return this._state;
    }
}
