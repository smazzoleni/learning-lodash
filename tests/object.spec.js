const _ = require('lodash');
const chai = require('chai');
const expect = chai.expect;

describe('Object', () => {
    describe('zipObject', () => {
        it('use case: transform csv data to objects where headers are object keys', () => {
            const parsedCsv = [
                ['firstName', 'lastName', 'age'],
                ['Sergio', 'Mazzoleni', 45],
                ['Adrien', 'De Mey', 26],
            ];

            const headers = _.head(parsedCsv);
            const data = _.tail(parsedCsv);

            const objects = _.map(data, entry => _.zipObject(headers, entry));

            expect(objects)
                .to.be.an('array')
                .with.length(2);

            const [first, second] = objects;
            expect(first).to.deep.equal({
                firstName: 'Sergio',
                lastName: 'Mazzoleni',
                age: 45,
            });
            expect(second).to.deep.equal({
                firstName: 'Adrien',
                lastName: 'De Mey',
                age: 26,
            });
        });
    });
});
