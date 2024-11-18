const assert = require('assert');
const service = require('../../../../../../yion/validators/string');

describe('String validator service', () => {
    describe('validate()', () => {
        it('should validate string', () => {
            assert.strictEqual(service.validate('foo', {}), 'foo');
        });

        it('should return default value for empty data', () => {
            assert.strictEqual(service.validate(null, { default: 'foo' }), 'foo');
        });

        it('should return null value for empty data and nullable', () => {
            assert.strictEqual(service.validate(null, { nullable: true }), null);
        });

        it('should return date value for data with date format', () => {
            assert.strictEqual(service.validate(null, { nullable: true }), null);
        });

        it('should return undefined value for empty data and not nullable', () => {
            assert.strictEqual(service.validate(null, { nullable: false }), undefined);
        });

        it('should return date value for data with date format', () => {
            const date = new Date('Thu Sep 30 2021');
            assert.deepStrictEqual(service.validate('2021-09-29T22:00:00.000Z', { format: 'date' }), date);
        });

        it('should return datetime value for data with date-time format', () => {
            const date = new Date('Thu Sep 30 2021 17:20:14 GMT+0200');
            assert.deepStrictEqual(service.validate('2021-09-30T15:20:14.000Z', { format: 'date-time' }), date);
        });

        it('should return decoded base64 value for data with byte format', () => {
            assert.strictEqual(service.validate('Ym9uam91cg==', { format: 'byte' }), 'bonjour');
        });

        it('should parse value to string', () => {
            assert.strictEqual(service.parse('toto', {}), 'toto');
        });

        it('should parse date value to string with date format', () => {
            const now = new Date();
            assert.strictEqual(service.parse(now, { format: 'date' }), now.toDateString());
        });

        it('should parse datetime value to string with date-time format', () => {
            const now = new Date();
            assert.strictEqual(service.parse(now, { format: 'date-time' }), now.toString());
        });

        it('should parse to base64 value to string with byte format', () => {
            assert.strictEqual(service.parse('bonjour', { format: 'byte' }), 'Ym9uam91cg==');
        });
    });
});
