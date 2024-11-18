const { JSON_MIMETYPE } = require('./http');
const { createFromModel } = require('../../../../yion/api/factory');

const writer = require('../../../../yion/api/writers/writer');
const validator = require('../../../../yion/validators/validator');
const BadRequestError = require('./../errors/bad-request');

module.exports = {
    /**
     * Wrap res object to add send function
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {object} [schemas={}]
     */
    wrapResponse(req, res, schemas = {}) {
        Object.defineProperties(res, {
            /**
             * Generate response from route, status and mimetype
             * @param {*} [data=null]
             * @param {number} [status=200]
             * @param {string|null} [statusMessage=null]
             */
            send: {
                value: function (data = null, status = 200, statusMessage = null) {
                    const response = schemas.responses ? schemas.responses[status] : null;
                    const mimetype = JSON_MIMETYPE;

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
                }
            }
        })
    },

    /**
     * Validate request body
     *
     * @param {IncomingMessage} req
     * @param {object} [schemas={}]
     */
    validateBody(req, schemas = {}) {
        const requestBody = schemas.requestBody;
        const contentType = req.headers['content-type'];
        let body = null;

        if (requestBody) {
            if (!requestBody.content[contentType]) {
                throw new BadRequestError(`Bad content type, please use ${Object.keys(requestBody.content).join()}`);
            }

            body = validator.validate(req.body, requestBody.content[contentType].schema);
        }

        req.body = body;
    },

    /**
     * Validate req parameters from path schema
     *
     * @param {IncomingMessage} req
     * @param {object} [schemas={}]
     */
    validatePath(req, schemas = {}) {
        if (req.params) {
            const schemaModel = { properties: {} };
            (schemas.parameters || [])
                .filter(parameter => parameter.in === 'path')
                .forEach(({ name, schema, required }) => schemaModel.properties[name] = { ...schema, required });

            req.params = validator.validate(req.params, schemaModel);
        }
    },

    /**
     * Validate req parameters from query schema
     *
     * @param {IncomingMessage} req
     * @param {object} [schemas={}]
     */
    validateQuery(req, schemas = {}) {
        if (req.query) {
            const schemaModel = { properties: {} };
            (schemas.parameters || [])
                .filter(parameter => parameter.in === 'query')
                .forEach(({ name, schema, required }) => schemaModel.properties[name] = { ...schema, required });

            req.query = validator.validate(req.query, schemaModel);
        }
    },
};
