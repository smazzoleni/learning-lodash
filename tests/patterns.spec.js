const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;

describe('usefull patterns', () => {
    it('remove falsy value in array (mutation)', () => {
        const data = ['a', undefined, 'b', null, 'c', false, 'd', 0, 'e'];
        _.remove(data, _.negate(_.identity));
        expect(data).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
    });

    it('get all truthy value (immutable)', () => {
        const data = ['a', undefined, 'b', null, 'c', false, 'd', 0, 'e'];
        expect(_.filter(data)).to.deep.equal(['a', 'b', 'c', 'd', 'e']);
    });

    // test pass but skipped for fastest execution
    it.skip('process expensive operations by chunks', done => {
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

    it('immutable reverse array (chain version, a bit verbose)', () => {
        const data = ['a', 'b', 'c'];
        const reversed = _.chain(data)
            .clone()
            .reverse()
            .value();
        expect(reversed).to.deep.equal(['c', 'b', 'a']);
        expect(data, 'immutable').to.deep.equal(['a', 'b', 'c']);
    });

    it('immutable reverse array (shorter version)', () => {
        const data = ['a', 'b', 'c'];
        // beware of operation order: first clone then reverse
        const reversed = _.reverse(_.clone(data));
        expect(reversed).to.deep.equal(['c', 'b', 'a']);
        expect(data, 'immutable').to.deep.equal(['a', 'b', 'c']);
    });
});
