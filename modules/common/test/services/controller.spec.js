const assert = require('assert');
const http = require('http');
const { send } = require('./../../services/controller');

describe('Controller service', () => {
    let route = {
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

            res = send(req, res, data);

            assert.strictEqual(res.finished, true);
            assert.strictEqual(res.statusCode, 200);
            assert.strictEqual(res.statusMessage, 'OK');
            assert.strictEqual(res.getHeader('Content-Type'), 'application/json');
        });

        it('should throw error if response doesnt exists', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            req.route = route;

            const data = { message: 'not found' };

            assert.throws(() => send(req, res, data, 404), Error);
        });
    });

    it('should throw error if mimetype doesnt exists', () => {
        let req = new http.IncomingMessage();
        let res = new http.ServerResponse(req);

        req.route = route;

        const data = { message: 'not found' };

        assert.throws(() => send(req, res, data, 200, 'text/html'), Error);
    });
});
