'use strict';

const pIsPromise = require('p-is-promise');
const isFn = require('is-fn');
const isGeneratorFn = require('is-generator-fn');
const co = require('co');

function pSeq(tasks) {
	let _tasks = [];

	if (arguments.length === 1 && tasks.reduce) {
		_tasks = tasks;
	} else {
		const args = Array.prototype.slice.call(arguments);

		for (const key in args) {
			if (Object.prototype.hasOwnProperty.call(args, key)) {
				_tasks.push(args[key]);
			}
		}
	}

	return _tasks.reduce((promise, task) => {
		return promise.then(value => {
			let next;

			if (pIsPromise(task)) {
				next = task;
			} else if (isFn(task)) {
				next = task(value);
				if (!pIsPromise(next)) {
					return;
				}
			} else if (isGeneratorFn(task)) {
				next = co(task(value));
			}

			if (pIsPromise(next)) {
				return next;
			}
		});
	}, Promise.resolve());
}

module.exports = (() => {
	return pSeq;
})();
