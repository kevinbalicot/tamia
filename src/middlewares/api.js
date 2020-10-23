const SwaggerParser = require('@apidevtools/swagger-parser');
const BadRequestError = require('./../../modules/common/errors/bad-request');
const InternalError = require('./../../modules/common/errors/internal');
const { matchRoute } = require('./../../modules/common/services/route-matcher');
const { send, validateBody } = require('./../../modules/common/services/controller');

module.exports = function(config, controllers, prefix = '') {
    let api = {};
    const parser = new SwaggerParser();
    parser.validate(config)
        .then(config => api = config)
        .catch(e => {
            console.error(e);
            process.exit(1);
        });

    /**
     * Perform request for API middleware
     *
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     * @param {function} next
     * @return {*}
     */
    const performRequest = (req, res, next) => {
        if (req.url === '/doc') {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(api));
        }

        for (let path in api.paths) {
            if (path && matchRoute(req, `${prefix}${path}`)) {
                const route = api.paths[path][req.method.toLowerCase()];

                if (!route) {
                    throw new BadRequestError('Method Not Allowed', 405);
                }

                if (!route.operationId) {
                    throw new InternalError(`Open API path need operationId.`);
                }

                if (!controllers[route.operationId] || typeof controllers[route.operationId] !== 'function') {
                    throw new InternalError(`Controller callback "${controllers[route.operationId]}" doesnt exists or it is not a function.`);
                }

                req.route = route;

                validateBody(req);

                return controllers[route.operationId](req, res, next);
            }
        }

        next();
    };

    return function(req, res, next) {
        try {
            performRequest(req, res, next);
        } catch (e) {
            console.error(e);
            send(req, res, { message: String(e) } , e.code || 500, e.message);
        }
    };
};
