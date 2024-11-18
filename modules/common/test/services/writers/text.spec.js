const http = require('http');
const assert = require('assert');
const writer = require('../../../../../../yion/api/writers/text');

describe('Text Writer service', () => {
    describe('write()', () => {
        it('should write object into res in plain text format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {foo: 'bar'};

            writer.write(res, obj);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.getHeader('Content-Type'), 'plain/text');
            assert.strictEqual(res.getHeader('Content-Size'), String(obj).length);
        });
    });
});
