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

        const now = new Date();
        fetch(`http://localhost:${NODE_PORT}/api/items`, { method: 'POST', headers, body: 'name=foo' }).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { id: 1, name: 'foo', createdAt: now.toDateString(), checked: false }))
            .then(() => done());
    });

    it('should call patch /items route with wrong id and get 404 error', (done) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const now = new Date();
        fetch(`http://localhost:${NODE_PORT}/api/items/10`, { method: 'PATCH', headers, body: 'checked=1' }).then(response => {
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { code: 404, message: 'Error: Item not found' }))
            .then(() => done());
    });

    it('should call patch /items route with wrong data and get 400 error', (done) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const now = new Date();
        fetch(`http://localhost:${NODE_PORT}/api/items/10`, { method: 'PATCH', headers, body: 'checked=bar' }).then(response => {
            assert.strictEqual(response.status, 400);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { code: 400, message: 'Error: Parameter "checked": Value is not a boolean' }))
            .then(() => done());
    });

    it('should call patch /items route', (done) => {
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const now = new Date();
        fetch(`http://localhost:${NODE_PORT}/api/items/1`, { method: 'PATCH', headers, body: 'name=bar&checked=1' }).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { id: 1, name: 'bar', createdAt: now.toDateString(), checked: true }))
            .then(() => done());
    });

    it('should call get /items route with new data', (done) => {
        const now = new Date();
        fetch(`http://localhost:${NODE_PORT}/api/items`).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, [{ id: 1, name: 'bar', createdAt: now.toDateString(), checked: true }]))
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
            .then(data => assert.deepStrictEqual(data, { code: 400, message: 'Error: Parameter "name" is required' }))
            .then(() => done());
    });

    it('should call get /items/{id} route', (done) => {
        const now = new Date();
        fetch(`http://localhost:${NODE_PORT}/api/items/1`).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { id: 1, name: 'bar', createdAt: now.toDateString(), checked: true }))
            .then(() => done());
    });

    it('should call get /items/{id} route with wrong id and get 404 error', (done) => {
        fetch(`http://localhost:${NODE_PORT}/api/items/10`).then(response => {
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { code: 404, message: 'Error: Item not found' }))
            .then(() => done());
    });

    it('should call delete /items/{id} route', (done) => {
        fetch(`http://localhost:${NODE_PORT}/api/items/1`, { method: 'DELETE' }).then(response => {
            assert.strictEqual(response.status, 204);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.text();
        })
            .then(data => assert.strictEqual(data, ''))
            .then(() => done());
    });

    it('should call delete /items/{id} route with wrong id and get 404 error', (done) => {
        fetch(`http://localhost:${NODE_PORT}/api/items/1`, { method: 'DELETE' }).then(response => {
            assert.strictEqual(response.status, 404);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.deepStrictEqual(data, { code: 404, message: 'Error: Item not found' }))
            .then(() => done());
    });

    after(() => worker.kill('SIGTERM'));
});
