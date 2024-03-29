/**
 * Queue handler for middlewares
 * @example
 * const compose = require('./compose');
 *
 * const middlewares = [() => {}, ...];
 *
 * compose(req, res, middlewares, next)();
 */

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 * @param {array<function>} middlewares
 * @param {function} [next = () => {}]
 * @param {object} [scope={}]
 *
 * @return {function} next
 */
module.exports = (req, res, middlewares, next = () => {}, scope = {}) => {
    let i = middlewares.length;

    while (i--) {
        next = middlewares[i].bind(scope, req, res, next);
    }

    return next;
};
