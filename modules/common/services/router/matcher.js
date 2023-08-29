const http = require('http');
const url = require('url');

module.exports = {
    /**
     * Match route and parse path parameters
     * Path parameters will available in req.params
     *
     * @param {IncomingMessage} req
     * @param {string} pattern
     * @param {string} [prefix='']
     * @return {boolean}
     */
    match(req, pattern, prefix = '') {
        if (!(req instanceof http.IncomingMessage)) {
            throw new Error(`"req" parameter has to be instance of IncomingMessage.`);
        }

        return module.exports.parseParametersFromRoute(req, pattern, prefix);
    },

    /**
     * Parse parameters from route
     * Parameters will available in req.params
     *
     * @param {IncomingMessage} req
     * @param {string} pattern
     * @param {string} [ignoredPrefix='']
     * @return {boolean}
     */
    parseParametersFromRoute(req, pattern, ignoredPrefix = '') {
        if (!(req instanceof http.IncomingMessage)) {
            throw new Error(`"req" parameter has to be instance of IncomingMessage.`);
        }

        const route = `^${pattern}$`;
        const keys = pattern.match(/{(\w+)}/g) || [];
        const parsedUrl = url.parse(req.url, true);

        let cleanPattern = route.replace(/\//g, '\\/');
        cleanPattern = cleanPattern.replace(/{(\w+)}/g, '((?:(?!\\/)[\\W\\w_])+)');

        const regexp = new RegExp(cleanPattern, 'g');
        const values = regexp.exec(parsedUrl.pathname.replace(ignoredPrefix, ''));

        req.query = parsedUrl.query;

        if (!!values) {
            req.params = {};
            keys.forEach((key, index) => {
                key = key.replace(/{(.+)}/g, '$1').trim();
                req.params[key] = values[index + 1] || null;
            });

            return true;
        }

        return false;
    },
};
