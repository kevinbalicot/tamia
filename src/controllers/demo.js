const BadRequestError = require('./../../modules/common/errors/bad-request');
const { send } = require('./../../modules/common/services/controller');

const items = [];
let id = 0;

module.exports = {
    getItemById(req, res) {
        const item = items.find(({ id }) => id === req.params.id);

        if (!item) {
            throw new BadRequestError('Item not found', 404);
        }

        return send(req, res, item);
    },

    getItems(req, res) {
        return send(req, res, items);
    },

    postItem(req, res) {
        req.body.id = ++id;
        items.push(req.body);

        return send(req, res, req.body);
    },
}
