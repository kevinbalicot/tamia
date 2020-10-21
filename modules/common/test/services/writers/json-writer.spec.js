const http = require('http');
const assert = require('assert');
const jsonWriter = require('./../../../services/writers/json-writer');

describe('JSON Writer server', () => {
    describe('writeJson()', () => {
        it('should write object into res with 200 code', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {foo: 'bar'};
            const parse = JSON.stringify(obj);

            jsonWriter.writeJson(res, obj);

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

            jsonWriter.writeJson(res, obj, 404);

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

            jsonWriter.writeJson(res, obj, 500, 'Oops !');

            assert.strictEqual(res.finished, false);
            assert.strictEqual(res.statusCode, 500);
            assert.strictEqual(res.statusMessage, 'Oops !');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });
    });

    describe('sendJson()', () => {
        it('should write object into res with 200 code and end it', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {foo: 'bar'};
            const parse = JSON.stringify(obj);

            jsonWriter.sendJson(res, obj);

            assert.strictEqual(res.finished, true);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.statusMessage, 'OK');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 404 code and end it', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {message: 'Not found'};
            const parse = JSON.stringify(obj);

            jsonWriter.sendJson(res, obj, 404);

            assert.strictEqual(res.finished, true);
            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.statusMessage, 'Not Found');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });

        it('should write object into res with 500 code and custom message and end it', () => {
            const req = new http.IncomingMessage();
            const res = new http.ServerResponse(req);
            const obj = {message: 'An error occurred'};
            const parse = JSON.stringify(obj);

            jsonWriter.sendJson(res, obj, 500, 'Oops !');

            assert.strictEqual(res.finished, true);
            assert.strictEqual(res.statusCode, 500);
            assert.strictEqual(res.statusMessage, 'Oops !');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
            assert.strictEqual(res.getHeader('Content-Size'), parse.length);
        });
    });
});
