# p-seq [![Build Status](https://travis-ci.org/unixzii/p-seq.svg?branch=master)](https://travis-ci.org/unixzii/p-seq)

> Run async tasks sequently

## Install

```
$ npm install --save p-seq
```

## Usage

```js
const pSeq = require('p-seq');

// op1, op2, op3 is functions that return a Promise.
pSeq(op1, op2, op3)
  .then(result => {
    // Get the result of last task here.
  })
  .catch(err => {
    // Reach here if any error thrown.
  });
```

When the `Promise` of a task resolved, **p-seq** passes its result to next function. So there will be only one task is running at one time.

## API

`pSeq(tasks)`
### Arguments
* tasks: An array of tasks, element type is `Promise`, `Function` or `GeneratorFunction`.

### Return Value
A `Promise` represented the last task.

### Discussion
When a task is `Promise`, **p-seq** just pass its result to next task. When a task is function or generator function, **p-seq** call it when last task is resolved, and pass the result of last task to it, the function must return a `Promise`. Since the generator is run via [co](https://www.npmjs.com/package/co), it produces a `Promise` intrinsically.

**There is also a more convenient way to pass tasks:**

`pSeq(task1, task2, ...)`

## License

MIT © [Cyandev](https://www.icyandev.com)