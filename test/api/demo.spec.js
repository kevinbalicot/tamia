require('dotenv').config();

const assert = require('assert');
const fetch = require('node-fetch');
const { spawn } = require('child_process');

describe('Demo controller', () => {
    let worker;
    const { NODE_PORT = 8080 } = process.env;

    before((done) => {
        worker = spawn('node', [`${__dirname}/../../server.js`]);
        worker.stdout.once('data', () => done());
    });

    it('should call get /items route', (done) => {
        fetch(`http://localhost:${NODE_PORT}/api/items`).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, []))
            .then(() => done());
    });

    it('should call post /items route', (done) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        fetch(`http://localhost:${NODE_PORT}/api/items`, { method: 'POST', headers, body: 'name=foo' }).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { name: 'foo', createdAt: null }))
            .then(() => done());
    });

    it('should call get /items route with new data', (done) => {
        fetch(`http://localhost:${NODE_PORT}/api/items`).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, [{ name: 'foo', createdAt: null }]))
            .then(() => done());
    });

    it('should get error when call post /items route with invalid data', (done) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        fetch(`http://localhost:${NODE_PORT}/api/items`, { method: 'POST', headers, body: '' }).then(response => {
            assert.strictEqual(response.status, 400);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { message: 'Error: Parameter "name" is required' }))
            .then(() => done());
    });

    after(() => worker.kill('SIGTERM'));
});