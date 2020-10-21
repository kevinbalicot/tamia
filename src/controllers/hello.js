const jsonWriter = require('./../../modules/common/services/writers/json-writer');

module.exports = {
    getHello(req, res) {
        return jsonWriter.sendJson(res, { message: 'Hello World!' });
    },
}
