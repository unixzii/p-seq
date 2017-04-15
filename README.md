# p-seq [![Build Status](https://travis-ci.org/unixzii/p-seq.svg?branch=master)](https://travis-ci.org/unixzii/p-seq) [![Coverage Status](https://coveralls.io/repos/github/unixzii/p-seq/badge.svg?branch=master)](https://coveralls.io/github/unixzii/p-seq?branch=master) [![NPM Version](https://img.shields.io/npm/v/p-seq.svg)](https://npmjs.org/package/p-seq) [![Dependencies Status](https://david-dm.org/unixzii/p-seq.svg)](https://david-dm.org/unixzii/p-seq)

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

When the `Promise` of a task resolved, **p-seq** passes its result to next task generator. So there will be only one task is running at one time.

## API

`pSeq(tasks)`
### Arguments
* tasks: An array of task generators, element type is `Promise`, `Function` or `GeneratorFunction`.

### Return Value
A `Promise` represented the last task.

### Discussion
When a task generator is `Promise`, **p-seq** just pass its result to next task. When it is a function or generator function, **p-seq** call it when last task is resolved, and pass the result of last task to it, the function should return a `Promise`, otherwise **p-seq** just pass the return value through. Since the generator is run via [co](https://www.npmjs.com/package/co), it produces a `Promise` intrinsically.

If a task generator's type is none of above, **p-seq** just pass itself through the chain, but we strongly recommend you to avoid doing that.

**There is also a more convenient way to pass tasks:**

`pSeq(task1, task2, ...)`

## License

MIT © [Cyandev](https://www.icyandev.com)