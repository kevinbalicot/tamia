const SwaggerParser = require('@apidevtools/swagger-parser');
const createApi = require('./middlewares/api');

const validateConfig = (config) => (new SwaggerParser()).validate(config);

module.exports = { createApi, validateConfig };
