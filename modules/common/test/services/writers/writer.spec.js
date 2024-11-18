const http = require('http');
const assert = require('assert');
const writer = require('../../../../../../yion/api/writers/writer');

describe('Writer service', () => {
    describe('write()', () => {
        it('should write object into res with 200 code on JSON format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = { foo: 'bar' };
            const parse = JSON.stringify(obj);

            writer.write(res, obj, 'application/json', 200);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.statusMessage, 'OK');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 404 code on JSON format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = { message: 'Not found' };
            const parse = JSON.stringify(obj);

            writer.write(res, obj, 'application/json', 404);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.statusMessage, 'Not Found');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 500 code and custom message on JSON format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {message: 'An error occurred'};
            const parse = JSON.stringify(obj);

            writer.write(res, obj, 'application/json', 500, 'Oops !');

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 500);
            assert.strictEqual(res.statusMessage, 'Oops !');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 200 code on plain text format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = { foo: 'bar' };

            writer.write(res, obj, 'plain/text');

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.statusMessage, 'OK');
            assert.strictEqual(res.getHeader('Content-Type'), 'plain/text');
            assert.strictEqual(res.getHeader('Content-Size'), String(obj).length);
        });

        it('should write object into res with 404 code on plain text format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = { message: 'Not found' };

            writer.write(res, obj, 'plain/text', 404);

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.statusMessage, 'Not Found');
            assert.strictEqual(res.getHeader('Content-Type'), 'plain/text');
            assert.strictEqual(res.getHeader('Content-Size'), String(obj).length);
        });

        it('should write object into res with 500 code and custom message on plain text format', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = { message: 'An error occurred' };

            writer.write(res, obj, 'plain/text', 500, 'Oops !');

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 500);
            assert.strictEqual(res.statusMessage, 'Oops !');
            assert.strictEqual(res.getHeader('Content-Type'), 'plain/text');
            assert.strictEqual(res.getHeader('Content-Size'), String(obj).length);
        });
    });
});
