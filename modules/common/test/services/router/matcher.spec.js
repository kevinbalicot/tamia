const assert = require('assert');
const http = require('http');
const routeMatcher = require('../../../services/router/matcher');

describe('Route matcher service', () => {
    describe('match()', () => {
        it('should match simple route like /foo', () => {
            const req = new http.IncomingMessage();
            req.url = '/foo';

            assert.strictEqual(routeMatcher.match(req, '/foo'), true);
        });
    });

    describe('parseParametersFromRoute()', () => {
        it('should parse parameter from route into req parameters', () => {
            const req = new http.IncomingMessage();
            req.url = '/foo/1';

            routeMatcher.parseParametersFromRoute(req, '/foo/{id}')

            assert.deepStrictEqual(req.params, { id: '1' });
        });

        it('should parse parameters from route into req parameters', () => {
            const req = new http.IncomingMessage();
            req.url = '/foo/bar/15';

            routeMatcher.parseParametersFromRoute(req, '/foo/{name}/{id}')

            assert.deepStrictEqual(req.params, { name: 'bar', id: '15' });
        });
    });
});
