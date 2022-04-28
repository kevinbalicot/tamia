const SwaggerParser = require('@apidevtools/swagger-parser');

const BadRequestError = require('./../../modules/common/errors/bad-request');
const InternalError = require('./../../modules/common/errors/internal');
const RouteMatcher = require('../../modules/common/services/router/matcher');
const { send, validateBody, validatePath, validateQuery } = require('./../../modules/common/services/controller');
const { validateSecurity } = require('./../../modules/security/services/controller');
const compose = require('./compose');

module.exports = function(config, controllers, plugins = []) {
    // https://swagger.io/docs/specification/about/

    let api = {};
    const parser = new SwaggerParser();
    parser.validate(config)
        .then(config => api = config)
        .catch(e => {
            console.error(e);
            process.exit(1);
        });

    const events = {
        middlewares: {},

        on(name, callback) {
            if (!this.middlewares[name]) {
                this.middlewares[name] = [];
            }

            this.middlewares[name].push(callback);
        },

        emit(name, req, res, next, ...data) {
            const middlewares = [];
            for (const eventName in this.middlewares) {
                if ((new RegExp(`^${eventName}$`, 'ig')).test(name)) {
                    middlewares.push(...this.middlewares[eventName]);
                }
            }

            if (middlewares.length) {
                return compose(req, res, middlewares, next, { api })(...data);
            }
        },
    };

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

                    req.route = route;
                    req.route.path = path;

                    events.emit(`before:${route.operationId}`, req, res, next);

                    if (api.components.securitySchemes && route.security) {
                        validateSecurity(req, res, api.components.securitySchemes, events);
                    }

                    validatePath(req);
                    validateQuery(req);
                    validateBody(req);

                    events.emit(route.operationId, req, res, next);

                    if (
                        !res.writableEnded &&
                        typeof controllers[route.operationId] === 'function'
                    ) {
                        controllers[route.operationId](req, res, next);
                    }

                    events.emit(`after:${route.operationId}`, req, res, next);

                    return;
                }
            }

            next();
        };

        compose(req, res, [].concat(...plugins, middleware), next, { api })();
    };

    return {
        request(req, res, next) {
            try {
                performRequest(req, res, next);
            } catch (e) {
                console.error(e);
                send(req, res, { message: String(e), code: e.code || 500 } , e.code || 500, e.message);
            }
        },

        ...events
    };
};
