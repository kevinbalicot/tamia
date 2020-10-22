const { JSON_MIMETYPE } = require('./http');
const { createFromModel } = require('./factory');

const jsonWriter = require('./writers/json');
const validator = require('./validators/validator');
const BadRequestError = require('./../errors/bad-request');
const InternatError = require('./../errors/internal');

module.exports = {
    /**
     * Generate response from route, code and mimetype
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {*} data
     * @param {number} [code=200]
     * @param {string} [mimetype=application/json]
     * @return {ServerResponse}
     */
    send(req, res, data, code = 200, mimetype = JSON_MIMETYPE) {
        const route = req.route;

        if (!route.responses || !route.responses[code]) {
            throw new InternatError(`No response found for code "${code}"`);
        }

        if (!route.responses[code].content[mimetype]) {
            throw new InternatError(`No response found with mimetype "${mimetype}"`);
        }

        let model = data;
        const response = route.responses[code].content[mimetype];
        if (response.schema.type === 'object') {
            model = createFromModel(data, response.schema);
        } else if (response.schema.type === 'array' && Array.isArray(data)) {
            model = data.map(item => createFromModel(item, response.schema.items));
        }

        switch (mimetype) {
            case JSON_MIMETYPE:
            default:
                res = jsonWriter.write(res, model, code)
        }

        res.end();

        return res;
    },

    /**
     * Validate request body
     *
     * @param {IncomingMessage} req
     * @return {Object|null}
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

        return body;
    },
};
