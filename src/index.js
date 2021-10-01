const middleware = require('./middlewares/api');
const { mergeComponents, mergePaths } = require('./services/config-merger');

/**
 * Bootstrap API middleware
 *
 * @param {Object} config
 * @param {Object} [options={}]
 * @return {function}
 */
module.exports = function(config, options = {}) {
    const { baseDir = process.env.PWD, plugins = [] } = options;

    try {
        const models = mergeComponents(...config.models.map(file => require(`${baseDir}${file}`)));
        const routes = mergePaths(...config.routes.map(file => require(`${baseDir}${file}`)));
        const controllers = Object.assign({}, ...config.controllers.map(file => require(`${baseDir}${file}`)));
        const apiConfig = Object.assign({}, config.api, models, routes);

        return middleware(apiConfig, controllers, plugins);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
