const assert = require('assert');
const { validate } = require('./../../../services/validators/string');

describe('String validator service', () => {
    describe('validate()', () => {
        it('should validate string', () => {
            assert.strictEqual(validate('foo', {}), 'foo');
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(validate(null, { default: 'foo' }), 'foo');
        });

        it('should throw error if value is not type of string', () => {
            assert.throws(() => validate(1, {}), Error);
        });
    });
});
