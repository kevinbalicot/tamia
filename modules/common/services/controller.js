const { JSON_MIMETYPE } = require('./http');
const { createFromModel } = require('./factory');

const writer = require('./writers/writer');
const validator = require('./validators/validator');
const BadRequestError = require('./../errors/bad-request');

module.exports = {
    /**
     * Generate response from route, status and mimetype
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {*} [data=null]
     * @param {number} [status=200]
     * @param {string|null} [statusMessage=null]
     */
    send(req, res, data = null, status = 200, statusMessage = null) {
        const route = req.route;
        const response = route ? route.responses[status] : null;

        let mimetype = JSON_MIMETYPE;
        let model = data;
        if (response && response.content) {
            //if (req.headers['accept'] && req.headers['accept'] !== '*/*') {
            //    mimetype = req.headers['accept'];
            //}

            //if (req.headers['accept'] && !response.content[mimetype]) {
            //    throw new BadRequestError('Not Acceptable', 406);
            //}

            const content = response.content[mimetype];
            if (content.schema.type === 'object') {
                model = createFromModel(data, content.schema, true);
            } else if (content.schema.type === 'array' && Array.isArray(data)) {
                model = data.map(item => createFromModel(item, content.schema.items, true));
            }
        }

        writer.write(res, model, mimetype, status, statusMessage);

        res.end();
    },

    /**
     * Validate request body
     *
     * @param {IncomingMessage} req
     */
    validateBody(req) {
        const requestBody = req.route.requestBody;
        const contentType = req.headers['content-type'];
        let body = null;

        if (requestBody && contentType) {
            if (!requestBody.content[contentType]) {
                throw new BadRequestError(`"${contentType}" request body doesnt exists`);
            }

            body = validator.validate(req.body, requestBody.content[contentType].schema);
        }

        req.body = body;
    },

    /**
     * Validate req parameters from path schema
     *
     * @param {IncomingMessage} req
     */
    validatePath(req) {
        if (req.params) {
            const schemaModel = { properties: {} };
            (req.route.parameters || [])
                .filter(parameter => parameter.in === 'path')
                .forEach(({ name, schema, required }) => schemaModel.properties[name] = { ...schema, required });

            req.params = validator.validate(req.params, schemaModel);
        }
    },

    /**
     * Validate req parameters from query schema
     *
     * @param {IncomingMessage} req
     */
    validateQuery(req) {
        if (req.query) {
            const schemaModel = { properties: {} };
            (req.route.parameters || [])
                .filter(parameter => parameter.in === 'query')
                .forEach(({ name, schema, required }) => schemaModel.properties[name] = { ...schema, required });

            req.query = validator.validate(req.query, schemaModel);
        }
    },
};
