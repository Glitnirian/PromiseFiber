import { PromiseFiber } from "../PromiseFiber";

type EventsPromisesClusters = { [name in any]: PromiseFiber[] };

export interface IResolverDefinition {
    resolve: (data?: any) => void,
    reject: (data?: any) => void
}



/**
 * The EventPromisesDefinition is an event to resolving method mapping
 *
 *
 * @export
 * @class PromiseFiberCluster
 * @template EventsPromisesDefinition
 */
export class PromiseFibersClusterer <
    EventsPromisesDefinition extends { [name: string]: any }
> {
    private _eventsPromisesClusters: EventsPromisesClusters;

    constructor() {
        this._eventsPromisesClusters = {};
    }

    public await(eventName: keyof EventsPromisesDefinition): Promise <
        Parameters<EventsPromisesDefinition[typeof eventName]['resolve']>[0]
    > {
        // ____________________________ create array if not already
        if (!this._eventsPromisesClusters[eventName]) {
            (this._eventsPromisesClusters as any)[eventName] = [];
        }

        // ____________________________ create the promise fiber
        const promiseFiber = new PromiseFiber();

        // ___________________________ push fiber
        this._eventsPromisesClusters[eventName].push(promiseFiber);

        // __________________________ return promise
        return promiseFiber.promise;
    }

    public resolve(
        eventName: keyof EventsPromisesDefinition,
        _this: any,
        ...args: Parameters<EventsPromisesDefinition[typeof eventName]['resolve']>
    ) {
        const promisesFibers = this._eventsPromisesClusters[eventName];
        if (promisesFibers) {
            // _________________________________________ resolve
            for (let i = 0; i < promisesFibers.length; i++) {
                promisesFibers[i].resolve.call(_this, ...args);
            }

            // _________________________________________ liberating the array
            this._eventsPromisesClusters[eventName] = [];
        }
    }

    public reject(
        eventName: keyof EventsPromisesDefinition,
        _this: any,
        ...args: Parameters<EventsPromisesDefinition[typeof eventName]['reject']>
    ) {
        const promisesFibers = this._eventsPromisesClusters[eventName];
        if (promisesFibers) {
            // _________________________________________ resolve
            for (let i = 0; i < promisesFibers.length; i++) {
                promisesFibers[i].reject.call(_this, ...args);
            }
        }

        // _________________________________________ liberating the array
        this._eventsPromisesClusters[eventName] = [];
    }
}
