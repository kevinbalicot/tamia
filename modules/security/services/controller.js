
module.exports = {
    validateSecurity(req) {
        if (req.route.security && req.route.security.length) {

        }
    },

    validateToken(req, scheme = 'bearer') {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            throw new Error('Need "Authorization" header');
        }

        authorizationHeader.replace(`/${scheme}/i`, '');
    },
};
