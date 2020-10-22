const assert = require('assert');
const http = require('http');
const routeMatcher = require('./../../services/route-matcher');

describe('Route matcher service', () => {
    describe('matchRoute()', () => {
        it('should match simple route like /foo', () => {
            const req = new http.IncomingMessage();
            req.url = '/foo';

            assert.strictEqual(routeMatcher.matchRoute(req, '/foo'), true);
        });
    });
});
