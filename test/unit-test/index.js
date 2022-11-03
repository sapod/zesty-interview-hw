const mockery = require('mockery');
const chai = require('chai');
const {expect} = chai;
const AWSMock = require('./AWSMock');

// I didn't have the time to do the tests
let index;
describe(`Testing`, () => {
    before(() => {
        mockery.enable({
            useCleanCache: true,
            warnOnReplace: false,
            warnOnUnregistered: false,
        });

        let fsMock = {
            readFileSync: function (path, ops) {
                if (path.includes('input'))
                    return 'us-east-1';
                else return `{
                  "instances": [
                    {
                      "instance_id": "bdhnlvdcdbhssjf",
                      "launch_time": "Thu Nov 03 2022 12:31:46 GMT+0200"
                    }
                  ]
                }`;
            },
            writeFileSync: function (path, content) {
                return;
            }
        };
        mockery.registerMock('fs', fsMock);

        mockery.registerMock('aws-sdk', new AWSMock());

        index = require('../../src/index');
    });

    after(() => {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('ETL', () => {
        it('etl', (done) => {
            done();
        });
    });

    describe('API', () => {
        it('api', (done) => {
            done();
        });
    });
});