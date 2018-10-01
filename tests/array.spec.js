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

    describe('flatten', () => {
        it('flattens array a single level deep', () => {
            const data = [[1, 2, 3], [4, 5]];
            expect(_.flatten(data)).to.deep.equal([1, 2, 3, 4, 5]);
        });

        it('empty arrays are ignored', () => {
            const data = [[1, 2, 3], [], [4, 5]];
            expect(_.flatten(data)).to.deep.equal([1, 2, 3, 4, 5]);
        });

        it('single values are processed as array of one element', () => {
            const data = [[1, 2], 3, [4, 5]];
            expect(_.flatten(data)).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe('flatterDeep', () => {
        it('recursively flattens array', () => {
            const data = [1, [2, 3, [], [[4]], 5]];
            expect(_.flattenDeep(data)).to.deep.equal([1, 2, 3, 4, 5]);
        });
    });

    describe('fromPairs', () => {
        it('returns an object composed from key-value pairs', () => {
            const keyValuePairs = [
                ['firstname', 'sergio'],
                ['lastname', 'mazzoleni'],
                ['birthdate', '04/09/1973'],
            ];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                firstname: 'sergio',
                lastname: 'mazzoleni',
                birthdate: '04/09/1973',
            });
        });

        it('extra values are ignored', () => {
            const keyValuePairs = [
                ['firstname', 'sergio', 'some', 'extra', 'value'],
            ];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                firstname: 'sergio',
            });
        });

        it('returns empty object from empty string', () => {
            expect(_.fromPairs([])).to.deep.equal({});
        });

        it('key with undefined value is present in result object', () => {
            const keyValuePairs = [['birthdate', undefined]];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                birthdate: undefined,
            });
        });

        it('key with no value is present in result object', () => {
            const keyValuePairs = [['birthdate']];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                birthdate: undefined,
            });
        });

        it('undefine key with value is present in result object ', () => {
            const keyValuePairs = [[undefined, 'some value']];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                undefined: 'some value',
            });
        });

        it('strings are seen as char arrays, so first char is key, second char is value and other are ignored', () => {
            const keyValuePairs = ['hello', 'bonjour', 'salut'];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                h: 'e',
                b: 'o',
                s: 'a',
            });
        });

        it('when duplicate keys, last value wins', () => {
            const keyValuePairs = [
                ['firstname', 'sergio'],
                ['firstname', 'isabelle'],
            ];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                firstname: 'isabelle',
            });
        });

        it('non string keys are stringified', () => {
            const keyValuePairs = [[{ a: 1 }, 'sergio']];
            expect(_.fromPairs(keyValuePairs)).to.deep.equal({
                '[object Object]': 'sergio',
            });
        });
    });

    describe('head / first', () => {
        it('returns first element of an array', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.head(data)).to.equal('sergio');
        });

        it('same result can be achieved with ES6 destructuring', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            const [first] = data;
            expect(first).to.equal('sergio');
        });

        it('return undefined if array is empty', () => {
            expect(_.head([])).to.be.undefined;
        });

        it('return undefined if array is null or undefined', () => {
            expect(_.head(null)).to.be.undefined;
            expect(_.head(undefined)).to.be.undefined;
        });

        it('return first char if argument is a string', () => {
            expect(_.head('hello')).to.equal('h');
        });

        it('return undefined if argument is an object', () => {
            expect(_.head({ a: 1 })).to.be.undefined;
        });
    });

    describe('indexOf', () => {
        it('gets the index at which the first occurrence of value is found in array using SameValueZero for equality comparisons', () => {
            const data = [
                'sergio',
                'isabelle',
                'philippe',
                'caroline',
                'christophe',
                'pascal',
            ];
            expect(_.indexOf(data, 'philippe')).to.equal(2);
        });

        it('returns -1 if value can not be found', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.indexOf(data, 'christophe')).to.equal(-1);
        });

        it('fromIndex can be specified (default is zero)', () => {
            const data = [
                'isabelle',
                'sergio',
                'philippe',
                'caroline',
                'sergio',
                'christophe',
                'pascal',
            ];
            expect(_.indexOf(data, 'sergio')).to.equal(1);
            expect(_.indexOf(data, 'sergio', 0)).to.equal(1);
            expect(_.indexOf(data, 'sergio', 1)).to.equal(1);
            expect(_.indexOf(data, 'sergio', 2)).to.equal(4);
            expect(_.indexOf(data, 'sergio', 6)).to.equal(-1);
        });

        it('negative fromIndex can be specified as offset from the end of array', () => {
            const data = [
                'isabelle',
                'sergio',
                'philippe',
                'caroline',
                'sergio',
                'christophe',
                'pascal',
            ];
            expect(_.indexOf(data, 'sergio', -2)).to.equal(-1);
            expect(_.indexOf(data, 'sergio', -3)).to.equal(4);
            expect(_.indexOf(data, 'sergio', -5)).to.equal(4);
            expect(_.indexOf(data, 'sergio', -6)).to.equal(1);
        });
    });

    describe('initial', () => {
        it('gets all but last element in array', () => {
            const data = ['sergio', 'isabelle', 'philippe', 'rené'];
            expect(_.initial(data)).to.deep.equal([
                'sergio',
                'isabelle',
                'philippe',
            ]);
        });

        it('returns empty array when argument is array with length 1', () => {
            expect(_.initial(['one'])).to.be.an('array').that.is.empty;
        });

        it('returns empty array when argument is empty array', () => {
            expect(_.initial([])).to.be.an('array').that.is.empty;
        });

        it('returns empty array when argument is null or undefined', () => {
            expect(_.initial(null)).to.be.an('array').that.is.empty;
            expect(_.initial(undefined)).to.be.an('array').that.is.empty;
            expect(_.initial()).to.be.an('array').that.is.empty;
        });

        it('returns array of chars when argument is a string', () => {
            expect(_.initial('hello')).to.deep.equal(['h', 'e', 'l', 'l']);
        });
    });

    describe('intersection', () => {
        it('creates an array of unique values that are included in all given arrays', () => {
            expect(_.intersection([1, 4, 7, 10], [2, 4, 8, 10])).to.deep.equal([
                4,
                10,
            ]);
        });

        it('order is determined by first array', () => {
            const array1 = [1, 2, 3, 4, 5];
            const array2 = [7, 6, 5, 4, 3];
            expect(_.intersection(array1, array2)).to.deep.equal([3, 4, 5]);
            expect(_.intersection(array2, array1)).to.deep.equal([5, 4, 3]);
        });

        it('does not work on strings', () => {
            expect(_.intersection('hello', 'world')).to.be.an('array').that.is
                .empty;
        });
    });

    describe('join', () => {
        it('converts all elements in array into a string separated by separator', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.join(data, ' - ')).to.equal(
                'sergio - isabelle - philippe',
            );
        });

        it('comma (,) is default separator', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.join(data)).to.equal('sergio,isabelle,philippe');
        });
    });

    describe('last', () => {
        it('returns last element of an array', () => {
            const data = ['sergio', 'isabelle', 'philippe'];
            expect(_.last(data)).to.equal('philippe');
        });

        it('return undefined if array is empty', () => {
            expect(_.last([])).to.be.undefined;
        });

        it('return undefined if array is null or undefined', () => {
            expect(_.last(null)).to.be.undefined;
            expect(_.last(undefined)).to.be.undefined;
        });

        it('return last char if argument is a string', () => {
            expect(_.last('hello')).to.equal('o');
        });

        it('return undefined if argument is an object', () => {
            expect(_.last({ a: 1 })).to.be.undefined;
        });
    });

    describe('nth', () => {
        it('gets the element at index n of array. If n is negative', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.nth(data, 2)).to.equal('c');
        });

        it('negative index returns nth element from the end of array', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.nth(data, -1)).to.equal('f');
            expect(_.nth(data, -3)).to.equal('d');
        });

        it('returns undefined if index is out of bounds', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.nth(data, 6)).to.be.undefined;
            expect(_.nth(data, -7)).to.be.undefined;
        });

        it('can be used with strings', () => {
            expect(_.nth('bonjour', 3)).to.equal('j');
        });
    });

    describe('pull', () => {
        it('removes values from array, mutating original array', () => {
            const data = ['a', 'b', 'a', 'c', 'd', 'e', 'c', 'f'];
            _.pull(data, 'a', 'c', 'f');
            expect(data).to.deep.equal(['b', 'd', 'e']);
        });

        it('returns reference to original array', () => {
            const data = ['a', 'b', 'a', 'c', 'd', 'e', 'c', 'f'];
            expect(_.pull(data, 'a', 'c', 'f')).to.equal(data);
        });

        it('cannot be used with strings as strings are readonly', () => {
            // expect(() => _.pull('bonjour', 'o')).to.throw(AssertionError);
            expect(() => _.pull('bonjour', 'o')).to.throw(
                'Cannot assign to read only property',
            );
        });
    });

    describe('pullAll', () => {
        it('same as pull, except it accepts an array of values', () => {
            const data = ['a', 'b', 'a', 'c', 'd', 'e', 'c', 'f'];
            _.pullAll(data, ['a', 'c', 'f']);
            expect(data).to.deep.equal(['b', 'd', 'e']);
        });
    });

    describe('pullAt', () => {
        it('removes elements corresponding to indexes', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            _.pullAt(data, 3);
            expect(data).to.deep.equal(['a', 'b', 'c', 'e', 'f']);
        });

        it('indexes can be one or several indexes', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            _.pullAt(data, 3, 4);
            expect(data).to.deep.equal(['a', 'b', 'c', 'f']);
        });

        it('indexes can be one or several arrays of indexes', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            _.pullAt(data, [3, 4], [1, 2]);
            expect(data).to.deep.equal(['a', 'f']);
        });
    });

    describe('remove', () => {
        it('mutates array by removing elements according predicate', () => {
            const data = ['a', 'b', 'a', 'c', 'd', 'e', 'a', 'f'];
            _.remove(data, l => l === 'a');
            expect(data).to.deep.equal(['b', 'c', 'd', 'e', 'f']);
        });

        it('returns new array of removed elments array', () => {
            const data = ['a', 'b', 'a', 'c', 'd', 'e', 'a', 'f'];
            expect(_.remove(data, l => l === 'a')).to.deep.equal([
                'a',
                'a',
                'a',
            ]);
        });

        it('default predicate is identity', () => {
            const data = ['a', undefined, 'b', null, 'c', false, 'd', 0, 'e'];
            _.remove(data);
            expect(data).to.deep.equal([undefined, null, false, 0]);
        });
    });

    describe('reverse', () => {
        it('invert order of elements in array (mutation)', () => {
            const data = ['a', 'b', 'c'];
            _.reverse(data);
            expect(data).to.deep.equal(['c', 'b', 'a']);
        });

        it('returns mutated array', () => {
            const data = ['a', 'b', 'c'];
            expect(_.reverse(data)).to.equal(data);
        });
    });

    describe('slice', () => {
        it('creates a slice from array from start up to (not included) end', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.slice(data, 1, 4)).to.deep.equal(['b', 'c', 'd']);
        });

        it('end is array length by default', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.slice(data, 4)).to.deep.equal(['e', 'f']);
        });

        it('when no start and no end, same as cloning array', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            const cloned = _.slice(data);
            expect(cloned, 'same element').to.deep.equal(data);
            expect(cloned, 'different instance').to.not.equal(data);
        });
    });

    describe('sortedIndex', () => {
        it('uses a binary search to determine the lowest index at which value should be inserted into array in order to maintain its sort order', () => {
            const data = ['a', 'b', 'c', 'e', 'f'];
            expect(_.sortedIndex(data, 'd')).to.equal(3);
        });

        it('return LOWEST index at which value should be inserted into array in order to maintain its sort order', () => {
            const data = ['a', 'b', 'c', 'd', 'd', 'e', 'f'];
            expect(_.sortedIndex(data, 'd')).to.equal(3);
        });

        it('no sense when array is not ordered, result is meaningless', () => {
            const data = ['c', 'b', 'g', 'a', 'c', 'a', 'f'];
            expect(_.sortedIndex(data, 'd')).to.equal(6);
        });
    });

    describe('sortedIndexOf', () => {
        it('returns index of value by performing a binary search on a sorted array', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.sortedIndexOf(data, 'c')).to.equal(2);
        });

        it('returns FIRST index of value', () => {
            const data = ['a', 'b', 'c', 'd', 'd', 'd', 'd', 'e', 'f'];
            expect(_.sortedIndexOf(data, 'd')).to.equal(3);
        });

        it('returns -1 if value is not found', () => {
            const data = ['a', 'b', 'c', 'd', 'e', 'f'];
            expect(_.sortedIndexOf(data, 'z')).to.equal(-1);
        });
    });
});
