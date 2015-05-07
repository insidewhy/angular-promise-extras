# angular-promise-extras

[![build status](https://circleci.com/gh/ohjames/angular-promise-extras.png)](https://circleci.com/gh/ohjames/angular-promise-extras)

## Installation

1. Install the package
    ```
    bower install --save angular-promise-extras
    ```

2. Add the bower source file to your web page.
3. Add the angular module `ngPromiseExtras` as a dependency of your application module.

## Usage

```javascript
var deferreds = [ $q.defer(), $q.defer(), 3 ]
var promises = deferreds.map(function(deferred) {
  return deferred.promise
})

$q.allSettled(promises).then(function(values) {
  expect(values).toEqual([
    { state: 'fulfilled', value: 1 },
    { state: 'rejected', reason: 2 },
    { state: 'fulfilled', value: 3 },
  ])
})

promises[0].resolve(1)
promises[1].reject(2)
```

Also works with objects:

```javascript
var deferreds = [ $q.defer(), $q.defer() ]
var promisesArray = deferreds.map(function(deferred) {
  return deferred.promise
})
var promises = { a: promisesArray[0], b: promisesArray[1], c: 3  }

$q.allSettled(promises).then(function(values) {
  expect(values).toEqual({
    a: { state: 'fulfilled', value: 1 },
    b: { state: 'rejected', reason: 2 },
    c: { state: 'fulfilled', value: 3 },
  })
})

promises[0].resolve(1)
promises[1].reject(2)
```
