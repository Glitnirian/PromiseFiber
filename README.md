# PromiseFiber

A promise fiber (`PromiseFiber`) that give the triple (promise, resolve, reject) simply! And allow flexibility!

Also a `PromiseFibersClusterer`! That allow stacking multiple Promises to the same event (cluster name)! And resolve and reject all at once! Great for multi place awaiting!

# Install

```sh
npm install promise-fiber --save
```

# Usage

## Import

From the main

```ts
import { PromiseFiber, PromiseFibersClusterer } from 'promise-fiber';
```

Each separately

```ts
import { PromiseFiber } from 'promise-fiber/PromiseFiber';
import { PromiseFibersClusterer } from 'promise-fiber/PromiseFibersClusterer';
```

## PromiseFiber example

Simple form

```ts
const promiseFiber = new PromiseFiber();

fetch('/endpointOmega', {
    method: 'GET'
})
.then(async (response) => {
    if(response.status === 200) {
        const res = await response.json();

        if (res.status === "OK") {
            promiseFiber.resolve(res.data);
        } else {
            promiseFiber.reject();
        }
    }
});


sys.launchTrack(async () => {
    const data =  await promiseFiber.await();
});

```

If we want many ! We can keep creating fibers!

### Typescript

```ts
export class PromiseFiber<ResolveT = any, ErrorT = any> {
    public promise: Promise<ResolveT>;
    public resolve: (data?: ResolveT) => void;
    public reject: (data?: ResolveT) => void;

    public await(): Promise<ResolveT>;
}
```

## PromiseFiberCluster example

Here for a more useful advance usage we have The Fibers clustering!

We stack multiple promises upon a one cluster and defined by a name!

In the example bellow we gonna name it Omega

js

```ts
const promiseFiberClusterer = new PromiseFiberClusterer();

sys1.launchTrack(async () => {
    const data =  await promiseFiber.await('omega'); // awaiting the omega cluster to resolve
});

sys2.launchTrack(async () => {
    const data =  await promiseFiber.await('omega'); // again in another scope (another promise)
});

fetch('/endpointOmega', {
    method: 'GET'
})
.then(async (response) => {
    if(response.status === 200) {
        const res = await response.json();

        if (res.status === "OK") {
            // resolve omega cluster (all stacked promises will be resolved)
            promiseFiberCluster.resolve('omega', res.data); // we precise the name of our stacking 
        } else {
            promiseFiberCluster.reject('omega');
        }
    }
});
```

Know too that we can have many clustering

For example taking the same old instance

```ts
const promise1 = promiseFiberCluster.await('alpha');
const promise2 = promiseFiberCluster.await('alpha');
const promise3 = promiseFiberCluster.await('alpha');

setTimeout(() => {
    promiseFiberClusterer.resolve('alpha', 'great');
}, 5000);
```

We can use the same instance to make as many clustering or stacks as we want!


Also once a cluster is resolved! And all the promises are resolved! It get cleaned! **And we can call it again**.


### Typescript

With typescript we can add the definition for our clustering

```ts
interface IFiberClusterDef {
    omega: {
        resolve: IData,
        reject: any
    },
    alpha: {
        resolve: 'great',
        reject: any
    }
}

const promiseFiberClusterer: PromiseFiberClusterer<IFiberClusterDef> = new PromiseFiberClusterer();


promiseFiberClusterer.await('omega') // autocompletion will work for 'omega', 'alpha'
    .then((data) => {
        // data is of type IData
    })
```
