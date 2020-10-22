const { send } = require('./../../modules/common/services/controller');

const items = [];

module.exports = {
    getItems(req, res) {
        return send(req, res, items);
    },

    postItem(req, res) {
        items.push(req.body);

        return send(req, res, req.body);
    },
}
