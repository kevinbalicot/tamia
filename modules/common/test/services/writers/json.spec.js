const http = require('http');
const assert = require('assert');
const writer = require('./../../../services/writers/json');

describe('JSON Writer service', () => {
    describe('write()', () => {
        it('should write object into res with 200 code', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {foo: 'bar'};
            const parse = JSON.stringify(obj);

            writer.write(res, obj);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.statusMessage, 'OK');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 404 code', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {message: 'Not found'};
            const parse = JSON.stringify(obj);

            writer.write(res, obj, 404);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.statusMessage, 'Not Found');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 500 code and custom message', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {message: 'An error occurred'};
            const parse = JSON.stringify(obj);

            writer.write(res, obj, 500, 'Oops !');

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 500);
            assert.strictEqual(res.statusMessage, 'Oops !');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });
    });
});
