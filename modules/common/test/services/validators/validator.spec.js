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
                    default: null,
                    properties: {
                        username: {
                            type: 'string'
                        }
                    }
                },
                private: {
                    type: 'boolean',
                    default: false
                },
                comments: {
                    type: 'array',
                    default: [],
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

        it('should validate data with schema with default values', () => {
            const data = { name: 'foo' };
            const expected = { name: 'foo', quantity: 1, author: null, comments: [], private: false };

            assert.deepStrictEqual(validate(data, schema), expected);
        });

        it('should validate data with schema with nullable values', () => {
            delete schema.properties.author.default;
            delete schema.properties.comments.default;

            schema.properties.author.nullable = true;
            schema.properties.comments.nullable = true;

            const data = { name: 'foo' };
            const expected = { name: 'foo', quantity: 1, author: null, comments: [], private: false };

            assert.deepStrictEqual(validate(data, schema), expected);
        });

        it('should validate data with schema with not nullable values', () => {
            schema.properties.author.nullable = false;
            schema.properties.comments.nullable = false;

            const data = { name: 'foo' };
            const expected = { name: 'foo', quantity: 1, private: false };

            assert.deepStrictEqual(validate(data, schema), expected);
        });

        it('should validate deep data with schema', () => {
            const data = { name: 'foo', author: { username: 'john' }, comments: [{ username: 'a' }, { username: 'a' }], private: true };
            const expected = { name: 'foo', quantity: 1, author: { username: 'john' }, comments: [{ username: 'a' }, { username: 'a' }], private: true };

            assert.deepStrictEqual(validate(data, schema), expected);
        });

        it('should throw error for required empty data', () => {
            assert.throws(() => validate({}, schema), BadRequestError);
        });
    });
});
