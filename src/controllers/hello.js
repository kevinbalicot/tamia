const { send } = require('./../../modules/common/services/controller');

module.exports = {
    getHello(req, res) {
        return send(req, res, { message: 'Hello World!' });
    },
}
