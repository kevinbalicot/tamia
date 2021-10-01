const NotFoundError = require('./../../modules/common/errors/not-found');
const { send } = require('./../../modules/common/services/controller');

const items = [];
let id = 0;

module.exports = {
    getItemById(req, res) {
        const item = items.find(({ id }) => id === req.params.id);

        if (!item) {
            throw new NotFoundError('Item not found', 404);
        }

        return send(req, res, item);
    },

    getItems(req, res) {
        return send(req, res, items);
    },

    postItem(req, res) {
        req.body.id = ++id;
        req.body.createdAt = new Date();
        items.push(req.body);

        return send(req, res, req.body);
    },

    patchItemById(req, res) {
        let index = items.findIndex(({ id }) => id === req.params.id);

        if (!items[index]) {
            throw new NotFoundError('Item not found', 404);
        }

        items[index] = { ...items[index], ...req.body };

        return send(req, res, items[index]);
    },

    deleteItemById(req, res) {
        const index = items.findIndex(({ id }) => id === req.params.id);

        if (index === -1) {
            throw new NotFoundError('Item not found', 404);
        }

        items.splice(index, 1);

        return send(req, res, null, 204);
    },
}
