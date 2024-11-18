const assert = require('assert');
const service = require('../../../../../../yion/validators/integer');

describe('Integer validator service', () => {
    describe('validate()', () => {
        it('should validate integer', () => {
            assert.strictEqual(service.validate(1, {}), 1);
            assert.strictEqual(service.validate('1', {}), 1);
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(service.validate(null, { default: 1 }), 1);
        });

        it('should return null value for empty data and nullable', () => {
            assert.strictEqual(service.validate(null, { nullable: true }), null);
        });

        it('should return undefined value for empty data and not nullable', () => {
            assert.strictEqual(service.validate(null, { nullable: false }), undefined);
        });

        it('should throw error if value is not type of integer', () => {
            assert.throws(() => service.validate('toto', {}), Error);
        });

        it('should parse value to integer', () => {
            assert.strictEqual(service.parse(0, {}), 0);
            assert.strictEqual(service.parse(1, {}), 1);
            assert.strictEqual(service.parse('1', {}), 1);
            assert.strictEqual(service.parse(20, {}), 20);
            assert.strictEqual(service.parse('20', {}), 20);
        });

        it('should throw error if value is not type of integer for parsing', () => {
            assert.throws(() => service.parse('toto', {}), Error);
        });
    });
});
