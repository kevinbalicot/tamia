const http = require('http');

module.exports = {
    /**
     * Write json into ServerResponse
     *
     * @param {ServerResponse} res
     * @param {Object|Array} data
     * @param {number} [status=200]
     * @param {string|null} [statusMessage=null]
     * @return {ServerResponse}
     */
    writeJson(res, data, status = 200, statusMessage = null) {
        if (!(res instanceof http.ServerResponse)) {
            throw new Error(`"res" parameter has to be instance of ServerResponse.`);
        }

        let json = {};
        try {
            json = JSON.stringify(data);
        } catch (e) {
            throw new Error(`"data" has to be an object or an Array.`);
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Size', json.length);
        res.statusCode = status;

        if (statusMessage) {
            res.statusMessage = statusMessage;
        }

        res.write(json);

        return res;
    },

    /**
     * Write json into response and end it
     *
     * @param {ServerResponse} res
     * @param {Object|Array} data
     * @param {number} [status=200]
     * @param {string|null} [statusMessage=null]
     * @return {ServerResponse}
     */
    sendJson(res, data, status = 200, statusMessage = null) {
        res = this.writeJson(res, data, status, statusMessage);
        res.end();

        return res;
    },
}
