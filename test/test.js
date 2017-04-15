/* global describe: true */
/* global it: true */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const pSeq = require('../');

const expect = chai.expect;

chai.use(chaiAsPromised);

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

function mockReadFile(filename) {
	return new Promise(resolve => {
		resolve(`This is the content of ${filename}!`);
	});
}

function mockErrorProducer() {
	return Promise.reject(new Error('a fake error'));
}

function asyncWork(ms, put, into) {
	return () => {
		return new Promise(resolve => {
			setTimeout(() => {
				if (into) {
					into.push(put);
				}
				resolve(into);
			}, ms);
		});
	};
}

function asyncWork2(multiplier) {
	return result => {
		return new Promise(resolve => {
			resolve(result * multiplier);
		});
	};
}

function * asyncWork3() {
	yield sleep(100);
	return 'test.txt';
}

function * asyncWork4(filename) {
	yield sleep(100);
	return yield mockReadFile(filename);
}

function * asyncWork5(content) {
	yield sleep(100);
	if (!content) {
		return 0;
	}
	return content.length;
}

describe('Run a sequence of functions that produce Promises', () => {
	it('should be sequently', () => {
		const results = [];
		return expect(pSeq(asyncWork(200, 1, results), asyncWork(100, 2, results), asyncWork(300, 3, results)))
			.to.eventually.deep.equal([1, 2, 3], 'order is wrong');
	});
});

describe('A task can pass its result to next task generator', () => {
	it('should return a number 24', () => {
		return expect(pSeq(Promise.resolve(1), asyncWork2(2), asyncWork2(3), asyncWork2(4)))
			.to.eventually.equal(24, 'result is wrong');
	});
});

describe('Run a sequence of generator functions', () => {
	it('should return a number 32', () => {
		return expect(pSeq(asyncWork3, asyncWork4, asyncWork5))
			.to.eventually.equal(32, 'result is wrong');
	});
});

describe('Two way to pass arguments', () => {
	it('should return a number 32', () => {
		return expect(pSeq([asyncWork3, asyncWork4, asyncWork5]))
			.to.eventually.equal(32, 'result is wrong');
	});
});

describe('Tasks that are not async', () => {
	it('should pass its result or itself through the chain', () => {
		return expect(pSeq([asyncWork3, asyncWork4, 'Hello', asyncWork5, count => count + 1]))
			.to.eventually.equal(6, 'result is wrong');
	});
});

describe('Handle error in a middle task', () => {
	it('should stop when error occurs', () => {
		return expect(pSeq(asyncWork3, asyncWork4, mockErrorProducer, asyncWork5))
			.to.be.rejectedWith('a fake error', 'unexpected result');
	});
});
