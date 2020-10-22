const assert = require('assert');
const BadRequestError = require('./../../../errors/bad-request');
const { validate } = require('./../../../services/validators/validator');

describe('Validator service', () => {
    describe('validate()', () => {
        const schema = {
            required: ['name'],
            properties: {
                name: {
                    type: 'string'
                },
                quantity: {
                    type: 'integer',
                    default: 1
                },
                author: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string'
                        }
                    }
                },
                comments: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        };

        it('should validate data with schema', () => {
            const data = { name: 'foo' };
            const expected = { name: 'foo', quantity: 1, author: null, comments: [] };

            assert.deepStrictEqual(validate(data, schema), expected);
        });

        it('should validate deep data with schema', () => {
            const data = { name: 'foo', author: { username: 'john' }, comments: [{ username: 'a' }, { username: 'a' }] };
            const expected = { name: 'foo', quantity: 1, author: { username: 'john' }, comments: [{ username: 'a' }, { username: 'a' }] };

            assert.deepStrictEqual(validate(data, schema), expected);
        });

        it('should throw error for required empty data', () => {
            assert.throws(() => validate({}, schema), BadRequestError);
        });
    });
});
