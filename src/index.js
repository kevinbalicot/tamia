const middleware = require('./middlewares/api');
const { mergeComponents, mergePaths } = require('./services/config-merger');

/**
 * Bootstrap API middleware
 *
 * @param {Object} config
 * @param {string|null} baseDir
 * @return {function}
 */
module.exports = function(config, baseDir = null) {
    baseDir = baseDir || process.env.PWD;
    try {
        const models = mergeComponents(...config.models.map(file => require(`${baseDir}${file}`)));
        const routes = mergePaths(...config.routes.map(file => require(`${baseDir}${file}`)));
        const controllers = Object.assign({}, ...config.controllers.map(file => require(`${baseDir}${file}`)));
        const apiConfig = Object.assign({}, config.api, models, routes);

        return middleware(apiConfig, controllers);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
