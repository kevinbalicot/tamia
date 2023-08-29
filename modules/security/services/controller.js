const BadRequestError = require('./../../common/errors/bad-request');

function _validateSecurities(req, res, securities, securitySchemes, events) {
    const next = () => true;
    for (const securityName in securities) {
        if (securitySchemes[securityName]) {
            const config = securitySchemes[securityName];
            if (!events.emit(`authentication:${securityName}`, req, res, next, config, securities[securityName], _validateToken(req, config.scheme))) {
                return false;
            }
        }
    }

    return true;
}

function _validateToken(req, scheme = 'bearer') {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        throw new BadRequestError('Need "Authorization" header', 403);
    }

    return authorizationHeader.replace(new RegExp(scheme, 'i'), '').trim();
}

module.exports = {
    validateSecurity(req, res, securitySchemes, globalSecurities, events) {
        for (const securityConfig of globalSecurities) {
            if (_validateSecurities(req, res, securityConfig, securitySchemes, events)) {
                return true;
            }
        }

        throw new BadRequestError('Forbidden', 403);
    },

    validateToken: _validateToken,
};
