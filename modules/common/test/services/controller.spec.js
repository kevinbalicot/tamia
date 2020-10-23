const assert = require('assert');
const http = require('http');
const BadRequestError = require('./../../errors/bad-request');
const { send, validateBody } = require('./../../services/controller');

describe('Controller service', () => {
    let route = {
        requestBody: {
            content: {
                "application/x-www-form-urlencoded": {
                    schema: {
                        required: ['name'],
                        properties: {
                            name: {
                                type: 'string',
                            },
                            quantity: {
                                type: 'integer',
                                default: 1,
                            }
                        }
                    }
                }
            }
        },
        responses: {
            '200': {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                message: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    describe('send()', () => {
        it('should write data into response', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            req.route = route;

            const data = { message: 'foo' };

            send(req, res, data);

            assert.strictEqual(res.finished, true);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.statusMessage, 'OK');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
        });

        it('should return something even if route doesnt exists', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            req.route = route;

            send(req, res, { message: 'not found' }, 404);

            assert.strictEqual(res.finished, true);
            assert.strictEqual(res.statusCode, 404);
            assert.strictEqual(res.statusMessage, 'Not Found');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
        });

        it('should throw error if mimetype doesnt exists', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            req.route = route;
            req.headers['accept'] = 'text/html';

            const data = { message: 'not found' };

            assert.throws(() => send(req, res, data), Error);
        });
    });

    describe('validateBody()', () => {
        it('should validate good body', () => {
            let req = new http.IncomingMessage();

            req.headers['content-type'] = 'application/x-www-form-urlencoded';

            const expected = { name: 'foo', quantity: 5 };
            req.route = route;
            req.body = expected;

            assert.deepStrictEqual(validateBody(req), expected);
        });

        it('should throw error if value required is empty', () => {
            let req = new http.IncomingMessage();

            req.headers['content-type'] = 'application/x-www-form-urlencoded';

            req.route = route;
            req.body = {};

            assert.throws(() => validateBody(req), BadRequestError);
        });

        it('should throw error if value have not good type', () => {
            let req = new http.IncomingMessage();

            req.headers['content-type'] = 'application/x-www-form-urlencoded';

            req.route = route;
            req.body = { name: 1, quantity: 'foo' };

            assert.throws(() => validateBody(req), BadRequestError);
        });

        it('should validate body and set default value for empty data', () => {
            let req = new http.IncomingMessage();

            req.headers['content-type'] = 'application/x-www-form-urlencoded';

            const expected = { name: 'foo' };
            req.route = route;
            req.body = expected;

            assert.deepStrictEqual(validateBody(req), { name: 'foo', quantity: 1 });
        });
    });
});
