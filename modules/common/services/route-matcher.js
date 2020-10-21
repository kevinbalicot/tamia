const http = require('http');

module.exports = {
    /**
     * Match route and parse path parameters
     * Path parameters will available in req.params
     *
     * @param {IncomingMessage} req
     * @param {string} pattern
     * @return {boolean}
     */
    matchRoute(req, pattern) {
        if (!(req instanceof http.IncomingMessage)) {
            throw new Error(`"req" parameter has to be instance of IncomingMessage.`);
        }

        return req.url === pattern;
    },


};
