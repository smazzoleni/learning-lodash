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
});
