const BadRequestError = require('./bad-request');

class NotFoundError extends BadRequestError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

module.exports = NotFoundError;
