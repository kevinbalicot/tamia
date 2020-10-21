require('dotenv').config();

const assert = require('assert');
const fetch = require('node-fetch');
const { spawn } = require('child_process');

describe('Hello controller', () => {
    let worker;
    const { NODE_PORT = 8080 } = process.env;

    before((done) => {
        worker = spawn('node', [`${__dirname}/../../server.js`]);
        worker.stdout.once('data', () => done());
    });

    it('should call get /hello route', (done) => {
        fetch(`http://localhost:${NODE_PORT}/api/hello`).then(response => {
            assert.strictEqual(response.status, 200);
            assert.strictEqual(response.headers.get('Content-Type'), 'application/json');

            return response.json();
        })
            .then(data => assert.strictEqual(data.message, 'Hello World!'))
            .then(() => done());
    });

    after(() => worker.kill('SIGTERM'));
});
