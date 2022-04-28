require('dotenv').config();

const http = require('http');
const connect = require('connect');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const tamiaApi = require('./src');
const { send } = require("./modules/common/services/controller");
const NotFoundError = require("./modules/common/errors/not-found");

const { NODE_PORT = 8080 } = process.env;
const app = connect();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));

const tamia = tamiaApi(
    require('./config/config.json'),
    {
        plugins: [
            require('@tamia/doc-plugin'),
        ]
    }
);

tamia.on('before:.*', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Origin, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.end();
    }

    next();
});

tamia.on('getHello', (req, res) => send(req, res, { message: 'Hello World!' }));

const items = [];
let id = 0;

tamia.on('getItems', (req, res) => send(req, res, items));

tamia.on('getItemById', (req, res) => {
    const item = items.find(({ id }) => id === req.params.id);

    if (!item) {
        throw new NotFoundError('Item not found', 404);
    }

    return send(req, res, item);
});

tamia.on('postItem', (req, res) => {
    req.body.id = ++id;
    req.body.createdAt = new Date();
    items.push(req.body);

    return send(req, res, req.body);
});

tamia.on('patchItemById', (req, res) => {
    let index = items.findIndex(({ id }) => id === req.params.id);

    if (!items[index]) {
        throw new NotFoundError('Item not found', 404);
    }

    items[index] = { ...items[index], ...req.body };

    return send(req, res, items[index]);
});


tamia.on('deleteItemById', (req, res) => {
    const index = items.findIndex(({ id }) => id === req.params.id);

    if (index === -1) {
        throw new NotFoundError('Item not found', 404);
    }

    items.splice(index, 1);

    return send(req, res, null, 204);
});

app.use('/api', tamia.request);

http.createServer(app)
    .listen(NODE_PORT)
    .on('listening', () => console.log(`Server started on port ${NODE_PORT}`));
