require('dotenv').config();

const http = require('http');
const connect = require('connect');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { mergeComponents, mergePaths } = require('./src/services/config-merger');

const { NODE_PORT = 8080 } = process.env;
const app = connect();
const config = require('./config/config.json');
const models = mergeComponents(...config.models.map(file => require(`${__dirname}${file}`)));
const routes = mergePaths(...config.routes.map(file => require(`${__dirname}${file}`)));
const controllers = Object.assign({}, ...config.controllers.map(file => require(`${__dirname}${file}`)));
const apiConfig = Object.assign({}, config.api, models, routes);

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: true }));

const api = require('./src/middlewares/api')(apiConfig, controllers);
app.use('/api', api);

http.createServer(app)
    .listen(NODE_PORT)
    .on('listening', () => console.log(`Server started on port ${NODE_PORT}`));
