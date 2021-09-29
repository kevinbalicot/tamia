const assert = require('assert');
const { validate, parse } = require('./../../../services/validators/string');

describe('String validator service', () => {
    describe('validate()', () => {
        it('should validate string', () => {
            assert.strictEqual(validate('foo', {}), 'foo');
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(validate(null, { default: 'foo' }), 'foo');
        });

        it('should return null value for empty data and nullable', () => {
            assert.strictEqual(validate(null, { nullable: true }), null);
        });

        it('should return undefined value for empty data and not nullable', () => {
            assert.strictEqual(validate(null, { nullable: false }), undefined);
        });

        it('should throw error if value is not type of string', () => {
            assert.throws(() => validate(1, {}), Error);
        });

        it('should parse value to string', () => {
            assert.strictEqual(parse('toto', {}), 'toto');
        });

        it('should throw error if value is not type of string for parsing', () => {
            assert.throws(() => parse(10, {}), Error);
        });
    });
});
