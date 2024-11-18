const http = require('http');
const assert = require('assert');
const writer = require('../../../../../../yion/api/writers/json');

describe('JSON Writer service', () => {
    describe('write()', () => {
        it('should write object into res in JSON format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {foo: 'bar'};
            const parse = JSON.stringify(obj);

            writer.write(res, obj);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });
    });
});
