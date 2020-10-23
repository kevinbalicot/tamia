const assert = require('assert');
const { validate } = require('./../../../services/validators/integer');

describe('Integer validator service', () => {
    describe('validate()', () => {
        it('should validate integer', () => {
            assert.strictEqual(validate(1, {}), 1);
            assert.strictEqual(validate('1', {}), 1);
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(validate(null, { default: 1 }), 1);
        });

        it('should throw error if value is not type of integer', () => {
            assert.throws(() => validate('toto', {}), Error);
        });
    });
});
