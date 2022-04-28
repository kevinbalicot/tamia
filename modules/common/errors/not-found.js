const BadRequestError = require('./bad-request');

module.exports = class NotFoundError extends BadRequestError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
