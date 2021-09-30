const assert = require('assert');
const service = require('./../../../services/validators/boolean');

describe('Boolean validator service', () => {
    describe('validate()', () => {
        it('should validate boolean', () => {
            assert.strictEqual(service.validate(1, {}), true);
            assert.strictEqual(service.validate('1', {}), true);
            assert.strictEqual(service.validate(0, {}), false);
            assert.strictEqual(service.validate('0', {}), false);
            assert.strictEqual(service.validate(true, {}), true);
            assert.strictEqual(service.validate('true', {}), true);
            assert.strictEqual(service.validate(false, {}), false);
            assert.strictEqual(service.validate('false', {}), false);
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(service.validate(null, { default: 1 }), true);
            assert.strictEqual(service.validate(null, { default: 0 }), false);
            assert.strictEqual(service.validate(null, { default: true }), true);
            assert.strictEqual(service.validate(null, { default: false }), false);
            assert.strictEqual(service.validate(null, { default: 'true' }), true);
            assert.strictEqual(service.validate(null, { default: 'false' }), false);
        });

        it('should throw error if value is not type of boolean', () => {
            assert.throws(() => service.validate('toto', {}), Error);
            assert.throws(() => service.validate(null, {}), Error);
        });

        it('should parse value to boolean', () => {
            assert.strictEqual(service.parse(1, {}), true);
            assert.strictEqual(service.parse('1', {}), true);
            assert.strictEqual(service.parse(true, {}), true);
            assert.strictEqual(service.parse('true', {}), true);
            assert.strictEqual(service.parse(0, {}), false);
            assert.strictEqual(service.parse('0', {}), false);
            assert.strictEqual(service.parse(false, {}), false);
            assert.strictEqual(service.parse('false', {}), false);
        });

        it('should throw error if value is not type of boolean for parsing', () => {
            assert.throws(() => service.parse('toto', {}), Error);
            assert.throws(() => service.parse(null, {}), Error);
        });
    });
});
