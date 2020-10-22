const SwaggerParser = require('@apidevtools/swagger-parser');
const { matchRoute } = require('./../../modules/common/services/route-matcher');

module.exports = async function(config, controllers, prefix = '') {
    let api = {};
    try {
        const parser = new SwaggerParser();
        api = await parser.validate(config);
    } catch (e) {
        throw new Error(e);
    }

    return function(req, res, next) {
        if (req.url === '/doc') {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify(api));
        }

        for (let path in api.paths) {
            if (path && matchRoute(req, `${prefix}${path}`) && api.paths[path][req.method.toLowerCase()]) {
                const route = api.paths[path][req.method.toLowerCase()];

                if (!route.operationId) {
                    throw new Error(`Open API path need operationId.`);
                }

                if (!controllers[route.operationId] || typeof controllers[route.operationId] !== 'function') {
                    throw new Error(`Controller callback "${controllers[route.operationId]}" doesnt exists or it is not a function.`);
                }

                req.route = route;

                return controllers[route.operationId](req, res, next);
            }
        }

        next();
    };
};
