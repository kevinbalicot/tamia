const assert = require('assert');
const { validate, parse } = require('./../../../services/validators/integer');

describe('Integer validator service', () => {
    describe('validate()', () => {
        it('should validate integer', () => {
            assert.strictEqual(validate(1, {}), 1);
            assert.strictEqual(validate('1', {}), 1);
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(validate(null, { default: 1 }), 1);
        });

        it('should return null value for empty data and nullable', () => {
            assert.strictEqual(validate(null, { nullable: true }), null);
        });

        it('should return undefined value for empty data and not nullable', () => {
            assert.strictEqual(validate(null, { nullable: false }), undefined);
        });

        it('should throw error if value is not type of integer', () => {
            assert.throws(() => validate('toto', {}), Error);
        });

        it('should parse value to integer', () => {
            assert.strictEqual(parse(1, {}), 1);
            assert.strictEqual(parse('1', {}), 1);
            assert.strictEqual(parse(20, {}), 20);
            assert.strictEqual(parse('20', {}), 20);
        });

        it('should throw error if value is not type of integer for parsing', () => {
            assert.throws(() => parse('toto', {}), Error);
        });
    });
});
