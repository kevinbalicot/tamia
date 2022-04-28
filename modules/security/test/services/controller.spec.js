const assert = require('assert');
const http = require('http');
const BadRequestError = require('./../../../common/errors/bad-request');
const { validateSecurity, validateToken } = require('./../../services/controller');

describe('Security controller service', () => {
    describe('validateToken()', () => {
        it('should validate bearer token', () => {
            let req = new http.IncomingMessage();
            req.headers['authorization'] = 'Bearer 1234567890';

            const token = validateToken(req, 'bearer');

            assert.strictEqual(token, '1234567890');
        });

        it('should validate basic token', () => {
            let req = new http.IncomingMessage();
            req.headers['authorization'] = 'Basic ZGVtbzpwQDU1dzByZA==';

            const token = validateToken(req, 'basic');

            assert.strictEqual(token, 'ZGVtbzpwQDU1dzByZA==');
        });

        it('should throw error if missing authorization header', () => {
            let req = new http.IncomingMessage();

            assert.throws(() => validateToken(req), BadRequestError);
        });
    });

    describe('validateSecurity()', () => {
        const securitySchemes = {
            "bearer": {
                "type": "http",
                "scheme": "bearer"
            },
            "basic": {
                "type": "http",
                "scheme": "basic"
            }
        };

        let route = {
            "security": [
                {
                    "bearer": []
                }
            ],
            requestBody: {
                content: {
                    "application/x-www-form-urlencoded": {
                        schema: {
                            required: ['name'],
                            properties: {
                                name: {
                                    type: 'string',
                                },
                                quantity: {
                                    type: 'integer',
                                    default: 1,
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                '200': {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string'
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };

        it('should validate bearer security', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            req.route = route;

            const events = {
                emit(event, req, res, next, config) {
                    if (config === securitySchemes['bearer']) {
                        return true;
                    }
                }
            };

            assert.deepStrictEqual(validateSecurity(req, res, securitySchemes, events), true);
        });

        it('should validate bearer or basic security', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            route.security = [
                {
                    "bearer": []
                },
                {
                    "basic": []
                }
            ];

            req.route = route;

            const events = {
                emit(event, req, res, next, config) {
                    if (config === securitySchemes['bearer']) {
                        return true;
                    }

                    if (config === securitySchemes['basic']) {
                        return true;
                    }
                }
            };

            assert.deepStrictEqual(validateSecurity(req, res, securitySchemes, events), true);
        });

        it('should throw error if authentication not passed', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            route.security = [
                {
                    "bearer": []
                }
            ];

            req.route = route;

            const events = {
                emit(event, req, res, next, config) {
                    if (config === securitySchemes['bearer']) {
                        return false;
                    }
                }
            };

            assert.throws(() => validateSecurity(req, res, securitySchemes, events), BadRequestError);
        });

        it('should throw error if some authentication not passed', () => {
            let req = new http.IncomingMessage();
            let res = new http.ServerResponse(req);

            route.security = [
                {
                    "bearer": [],
                    "basic": []
                }
            ];

            req.route = route;

            const events = {
                emit(event, req, res, next, config) {
                    if (config === securitySchemes['bearer']) {
                        return true;
                    }

                    if (config === securitySchemes['basic']) {
                        return false;
                    }
                }
            };

            assert.throws(() => validateSecurity(req, res, securitySchemes, events), BadRequestError);
        });
    });
});
