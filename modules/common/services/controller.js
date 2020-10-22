const { JSON_MIMETYPE } = require('./http');
const { createFromModel } = require('./factory');
const jsonWriter = require('./writers/json');

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
            throw new Error(`No response found for code "${code}"`);
        }

        if (!route.responses[code].content[mimetype]) {
            throw new Error(`No response found with mimetype "${mimetype}"`);
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
    }
};
