const SwaggerParser = require('@apidevtools/swagger-parser');

const BadRequestError = require('./../../modules/common/errors/bad-request');
const InternalError = require('./../../modules/common/errors/internal');
const RouteMatcher = require('../../modules/common/services/router/matcher');
const { validateBody, validatePath, validateQuery, wrapResponse } = require('./../../modules/common/services/controller');
const { validateSecurity } = require('./../../modules/security/services/controller');
const compose = require('./compose');

module.exports = function(config, options = {}) {
    // https://swagger.io/docs/specification/about/
    const { plugins = [], prefix = "" } = options;

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
                if (path && RouteMatcher.match(req, path, prefix)) {
                    const route = api.paths[path][req.method.toLowerCase()];

                    if (!route) {
                        throw new BadRequestError('Method Not Allowed', 405);
                    }

                    if (!route.operationId) {
                        throw new InternalError('Open API path need operationId.');
                    }

                    wrapResponse(req, res, route);

                    events.emit(`before:${route.operationId}`, req, res, next);

                    if (api.components.securitySchemes && route.security) {
                        validateSecurity(req, res, api.components.securitySchemes, route.security, events);
                    }

                    validatePath(req, route);
                    validateQuery(req, route);
                    validateBody(req, route);

                    events.emit(route.operationId, req, res, next);
                    events.emit(`after:${route.operationId}`, req, res, next);

                    return;
                }
            }

            next();
        };

        compose(req, res, [].concat(...plugins, middleware), next, { api })();
    };

    return {
        middleware(req, res, next) {
            try {
                performRequest(req, res, next);
            } catch (e) {
                console.error(e);

                res.statusCode = e.code || 500;
                res.statusMessage = e.message;
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify({ message: String(e), code: e.code || 500 }));
                res.end();
            }
        },

        ...events
    };
};
