require('dotenv').config();

const http = require('http');
const connect = require('connect');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const tamiaApi = require('./src');

const { NODE_PORT = 8080 } = process.env;
const app = connect();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));

const middleware = tamiaApi(
    require('./config/config.json'),
    {
        plugins: [
            require('@tamia/doc-plugin'),
        ]
    }
);

app.use('/api', middleware);

http.createServer(app)
    .listen(NODE_PORT)
    .on('listening', () => console.log(`Server started on port ${NODE_PORT}`));
