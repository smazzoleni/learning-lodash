const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;

describe('Array', () => {
    describe('chunk', () => {
        it('splits one array into array chunks of specified size', () => {
            const data = _.range(20);
            const chunks = _.chunk(data, 5);
            expect(_.size(chunks)).to.equal(20 / 5);
            expect(_.nth(chunks, 0)).to.deep.equal([0, 1, 2, 3, 4]);
            expect(_.nth(chunks, 1)).to.deep.equal([5, 6, 7, 8, 9]);
            expect(_.nth(chunks, 2)).to.deep.equal([10, 11, 12, 13, 14]);
            expect(_.nth(chunks, 3)).to.deep.equal([15, 16, 17, 18, 19]);
        });

        it('default size is 1', () => {
            const data = _.range(5);
            expect(_.chunk(data)).to.deep.equal([[0], [1], [2], [3], [4]]);
        });

        it('can be used on string', () => {
            const chunks = _.chunk('hello world', 3);
            expect(chunks).to.deep.equal([
                ['h', 'e', 'l'],
                ['l', 'o', ' '],
                ['w', 'o', 'r'],
                ['l', 'd'],
            ]);
        });

        // test pass but skipped for fastest execution
        it.skip('can be used to split expensive operations', done => {
            const logs = [];
            let finished = false;

            function doExpensiveWork(chunk) {
                const millisByItem = 10;
                const minimalDuration = _.size(chunk) * millisByItem;
                const start = new Date().valueOf();

                while (new Date().valueOf() - start < minimalDuration) {}
                const duration = new Date().valueOf() - start;
            }

            function processChunk(chunks, index) {
                const chunk = _.nth(chunks, index);
                if (_.isUndefined(chunk)) {
                    finished = true;
                    expect(logs).to.deep.equal([
                        'chunk 0',
                        'refresh',
                        'chunk 1',
                        'refresh',
                        'chunk 2',
                        'refresh',
                        'chunk 3',
                        'refresh',
                        'chunk 4',
                        'refresh',
                    ]);
                    done();
                    return;
                }
                logs.push(`chunk ${index}`);
                doExpensiveWork(chunk);
                _.defer(() => processChunk(chunks, ++index));
            }

            const intervalHandle = setInterval(() => {
                logs.push(`refresh`);
                // console.log('refresh user interface');
                if (finished) {
                    clearInterval(intervalHandle);
                }
            }, 20);

            const data = _.range(50);
            const chunks = _.chunk(data, 10);

            processChunk(chunks, 0);
        });
    });

    describe('compact', () => {
        const data = [
            'a',
            false,
            'b',
            null,
            'c',
            0,
            'd',
            undefined,
            'e',
            NaN,
            'f',
        ];

        it('creates array with falsey value removed (false, null, 0, "", undefined, NaN)', () => {
            expect(_.compact(data)).to.deep.equal([
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
            ]);
        });

        it('equivalent to filter with default predicate', () => {
            expect(_.filter(data)).to.deep.equal([
                'a',
                'b',
                'c',
                'd',
                'e',
                'f',
            ]);
        });
    });

    describe('concat', () => {
        const initialArray = ['sergio', 1234];

        it('creates array with initial array and one additional value', () => {
            const concatenated = _.concat(initialArray, 'Isabelle');
            expect(concatenated).to.deep.equal(['sergio', 1234, 'Isabelle']);
        });

        it('creates array with initial array and several additional values', () => {
            const concatenated = _.concat(
                initialArray,
                'Isabelle',
                'Philippe',
                'Christophe',
            );
            expect(concatenated).to.deep.equal([
                'sergio',
                1234,
                'Isabelle',
                'Philippe',
                'Christophe',
            ]);
        });

        it('creates array with initial array and each value from another array', () => {
            const concatenated = _.concat(initialArray, [
                'Isabelle',
                'Philippe',
                'Christophe',
            ]);
            expect(concatenated).to.deep.equal([
                'sergio',
                1234,
                'Isabelle',
                'Philippe',
                'Christophe',
            ]);
        });

        it('creates array with initial array and each value from several other arrays', () => {
            const concatenated = _.concat(
                initialArray,
                ['Isabelle', 'Philippe'],
                ['Christophe', 'Pascal'],
            );
            expect(concatenated).to.deep.equal([
                'sergio',
                1234,
                'Isabelle',
                'Philippe',
                'Christophe',
                'Pascal',
            ]);
        });

        it('use array of array to add one element as an array ', () => {
            const concatenated = _.concat(initialArray, [
                ['Isabelle', 'Philippe'],
            ]);
            expect(concatenated).to.deep.equal([
                'sergio',
                1234,
                ['Isabelle', 'Philippe'],
            ]);
        });
    });

    describe('difference', () => {
        it('creates an array of values from first array that are not included in other array', () => {
            const data = _.range(10);
            const diff = _.difference(data, [7, 8, 3, 4, 5, 200]);
            expect(diff).to.deep.equal([0, 1, 2, 6, 9]);
        });

        it('creates an array of values from first array that are not included in all other arrays', () => {
            const data = _.range(10);
            const diff = _.difference(data, [7, 8], [3, 4, 5], [200]);
            expect(diff).to.deep.equal([0, 1, 2, 6, 9]);
        });

        it('ignore non-array arguments', () => {
            const data = _.range(10);
            const diff = _.difference(data, 5, 6, 7);
            expect(diff).to.deep.equal(data);
        });

        it('uses SameValueZero for equality comparison', () => {
            const data = [{ x: 12 }, { x: 34 }, { x: 56 }];
            const diff = _.difference(data, [{ x: 12 }, { x: 56 }]);
            expect(diff).to.deep.equal(data);
            // NOTE: use differenceWith to avoid this pitfall
        });
    });

    describe('differenceBy', () => {
        it('same as difference when no iteratee argument is passed', () => {
            const data = _.range(10);
            const diff = _.differenceBy(data, [7, 8, 3, 4, 5, 200]);
            expect(diff).to.deep.equal([0, 1, 2, 6, 9]);
        });

        it('can use a function as iteratee', () => {
            const data = [1.1, 2.2, 3.3, 4.4, 5.5];
            const diff = _.differenceBy(data, [1.9, 2.9, 5.9], Math.floor);
            expect(diff).to.deep.equal([3.3, 4.4]);
        });

        it('can use a function as iteratee (variant)', () => {
            const data = [1.1, 2.2, 3.3, 4.4, 5.5];
            const diff = _.differenceBy(data, [1.9, 2.9, 5.9], _.floor);
            expect(diff).to.deep.equal([3.3, 4.4]);
        });

        it('can use an anonymous function as iteratee', () => {
            const data = [1.11, 1.12, 1.13, 1.21, 1.31];
            const diff = _.differenceBy(data, [1.17], item => _.floor(item, 1));
            expect(diff).to.deep.equal([1.21, 1.31]);
        });

        it('can use partial function as iteratee (more compact variant of previous)', () => {
            const data = [1.11, 1.12, 1.13, 1.21, 1.31];
            const floorWithOneDigitPrecison = _.partialRight(_.floor, 1);
            const diff = _.differenceBy(
                data,
                [1.17],
                floorWithOneDigitPrecison,
            );
            expect(diff).to.deep.equal([1.21, 1.31]);
        });
    });

    describe('differenceWith', () => {
        it('accepts a comparator', () => {
            const data = [{ x: 12 }, { x: 34 }, { x: 56 }];
            const diff = _.differenceWith(
                data,
                [{ x: 12 }, { x: 56 }],
                _.isEqual,
            );
            expect(diff).to.deep.equal([{ x: 34 }]);
        });

        it('comparator is useful when element structure is different', () => {
            const data = [{ x: 12 }, { x: 34 }, { x: 56 }];
            const diff = _.differenceWith(
                data,
                [{ y: 12 }, { y: 56 }],
                (dataValue, otherValue) => dataValue.x === otherValue.y,
            );
            expect(diff).to.deep.equal([{ x: 34 }]);
        });
    });

    describe('drop', () => {
        it('creates a slice of array with n elements dropped from the beginning', () => {
            const data = _.range(5);
            expect(_.drop(data, 3)).to.deep.equal([3, 4]);
        });

        it('creates a slice of array with 1 element dropped from the beginning if n is omitted', () => {
            const data = _.range(5);
            expect(_.drop(data), 'first value (0) is dropped').to.deep.equal([
                1,
                2,
                3,
                4,
            ]);
        });

        it('returns empty array if n >= array size', () => {
            const data = _.range(5);
            expect(_.drop(data, 5)).to.be.empty;
            expect(_.drop(data, 100)).to.be.empty;
        });

        it('returns cloned array if n <= 0', () => {
            const data = _.range(5);
            expect(_.drop(data, 0)).to.deep.equal(data);
            expect(_.drop(data, -10)).to.deep.equal(data);
        });
    });

    describe('dropRight', () => {
        it('creates a slice of array with n elements dropped from the end', () => {
            const data = _.range(5);
            expect(_.dropRight(data, 3)).to.deep.equal([0, 1]);
        });

        it('creates a slice of array with 1 element dropped from the end if n is omitted', () => {
            const data = _.range(5);
            expect(
                _.dropRight(data),
                'first value (0) is dropped',
            ).to.deep.equal([0, 1, 2, 3]);
        });

        it('returns empty array if n >= array size', () => {
            const data = _.range(5);
            expect(_.dropRight(data, 5)).to.be.empty;
            expect(_.dropRight(data, 100)).to.be.empty;
        });

        it('returns cloned array if n <= 0', () => {
            const data = _.range(5);
            expect(_.dropRight(data, 0)).to.deep.equal(data);
            expect(_.dropRight(data, -10)).to.deep.equal(data);
        });
    });

    describe('dropWhile', () => {
        it('creates a slice of array excluding elements dropped from the beginning while predicate returns truthy', () => {
            const data = [1, 2, 3, 'hello', 4, 'world'];
            const res = _.dropWhile(data, _.isNumber);
            expect(res).to.deep.equal(['hello', 4, 'world']);
        });
    });

    describe('dropRightWhile', () => {
        it('creates a slice of array excluding elements dropped from the end while predicate returns truthy', () => {
            const data = ['hello', 1, 'world', 2, 3, 4];
            const res = _.dropRightWhile(data, _.isNumber);
            expect(res).to.deep.equal(['hello', 1, 'world']);
        });
    });

    describe('fill', () => {
        it('fills all elements of array with value', () => {
            const data = _.range(5);
            _.fill(data, '*');
            expect(data).to.deep.equal(['*', '*', '*', '*', '*']);
        });

        it('fills elements of array after start index with value', () => {
            const data = _.range(5);
            _.fill(data, '*', 2);
            expect(data).to.deep.equal([0, 1, '*', '*', '*']);
        });

        it('fills elements of array after start index and before end with value', () => {
            const data = _.range(5);
            _.fill(data, '*', 1, 3);
            expect(data).to.deep.equal([0, '*', '*', 3, 4]);
        });

        it('does nothing when start index >= end index', () => {
            const data = _.range(5);
            _.fill(data, '*', 3, 3);
            expect(data).to.deep.equal([0, 1, 2, 3, 4]);
            _.fill(data, '*', 3, 1);
            expect(data).to.deep.equal([0, 1, 2, 3, 4]);
        });

        it('does nothing when invoked on string', () => {
            const data = 'hello';
            _.fill(data, '*');
            expect(data).to.equal('hello');
        });
    });

    describe('findIndex', () => {
        it('returns index of element in array of primitives using value as predicate', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.findIndex(data, value => value == 'sergio')).to.equal(0);
            expect(_.findIndex(data, value => value == 'isabelle')).to.equal(1);
            expect(_.findIndex(data, value => value == 'philippe')).to.equal(2);
            expect(_.findIndex(data, value => value == 'rené')).to.equal(-1);
        });

        it('returns index of element in array of primitives using value as predicate (cleaner variant using _.matches)', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.findIndex(data, _.matches('sergio'))).to.equal(0);
            expect(_.findIndex(data, _.matches('isabelle'))).to.equal(1);
            expect(_.findIndex(data, _.matches('philippe'))).to.equal(2);
            expect(_.findIndex(data, _.matches('rené'))).to.equal(-1);
        });

        it('caution: a primitive value as a predicate does not work as Array.indexOf', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.findIndex(data, 'sergio')).to.equal(-1);
            expect(_.findIndex(data, 'isabelle')).to.equal(-1);
            expect(_.findIndex(data, 'philippe')).to.equal(-1);
        });

        it('with pluck style, finds index of first object where value is truthy', () => {
            const data = [
                { firstname: 'sergio' },
                { firstname: 'isabelle', age: 0 },
                { firstname: 'rené', age: '' },
                { firstname: 'filomene', age: null },
                { firstname: 'philippe', age: 33 },
            ];

            expect(_.findIndex(data, 'age')).to.equal(4);
        });
    });
});
