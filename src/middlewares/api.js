const SwaggerParser = require('@apidevtools/swagger-parser');

const BadRequestError = require('./../../modules/common/errors/bad-request');
const InternalError = require('./../../modules/common/errors/internal');
const RouteMatcher = require('../../modules/common/services/router/matcher');
const { send, validateBody, validatePath } = require('./../../modules/common/services/controller');
const compose = require('./compose');

module.exports = function(config, controllers, plugins = []) {
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
     */
    const performRequest = (req, res, next) => {
        const middleware = (req, res, next) => {
            for (let path in api.paths) {
                if (path && RouteMatcher.match(req, path)) {
                    const route = api.paths[path][req.method.toLowerCase()];

                    if (!route) {
                        throw new BadRequestError('Method Not Allowed', 405);
                    }

                    if (!route.operationId) {
                        throw new InternalError('Open API path need operationId.');
                    }

                    if (!controllers[route.operationId] || typeof controllers[route.operationId] !== 'function') {
                        throw new InternalError(`Controller callback "${route.operationId}" doesn't exists or it is not a function.`);
                    }

                    req.route = route;
                    req.route.path = path;

                    validatePath(req);
                    validateBody(req);

                    return controllers[route.operationId](req, res, next);
                }
            }

            next();
        };

        plugins.push(middleware);

        compose(req, res, plugins, next, { api })();
    };

    return function(req, res, next) {
        try {
            performRequest(req, res, next);
        } catch (e) {
            console.error(e);
            send(req, res, { message: String(e), code: e.code || 500 } , e.code || 500, e.message);
        }
    };
};
