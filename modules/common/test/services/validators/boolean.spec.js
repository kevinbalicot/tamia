const assert = require('assert');
const { validate, parse } = require('./../../../services/validators/boolean');

describe('Boolean validator service', () => {
    describe('validate()', () => {
        it('should validate boolean', () => {
            assert.strictEqual(validate(1, {}), true);
            assert.strictEqual(validate('1', {}), true);
            assert.strictEqual(validate(0, {}), false);
            assert.strictEqual(validate('0', {}), false);
            assert.strictEqual(validate(true, {}), true);
            assert.strictEqual(validate('true', {}), true);
            assert.strictEqual(validate(false, {}), false);
            assert.strictEqual(validate('false', {}), false);
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(validate(null, { default: 1 }), true);
            assert.strictEqual(validate(null, { default: 0 }), false);
            assert.strictEqual(validate(null, { default: true }), true);
            assert.strictEqual(validate(null, { default: false }), false);
            assert.strictEqual(validate(null, { default: 'true' }), true);
            assert.strictEqual(validate(null, { default: 'false' }), false);
        });

        it('should throw error if value is not type of boolean', () => {
            assert.throws(() => validate('toto', {}), Error);
            assert.throws(() => validate(null, {}), Error);
        });

        it('should parse value to boolean', () => {
            assert.strictEqual(parse(1, {}), true);
            assert.strictEqual(parse('1', {}), true);
            assert.strictEqual(parse(true, {}), true);
            assert.strictEqual(parse('true', {}), true);
            assert.strictEqual(parse(0, {}), false);
            assert.strictEqual(parse('0', {}), false);
            assert.strictEqual(parse(false, {}), false);
            assert.strictEqual(parse('false', {}), false);
        });

        it('should throw error if value is not type of boolean for parsing', () => {
            assert.throws(() => parse('toto', {}), Error);
            assert.throws(() => parse(null, {}), Error);
        });
    });
});
