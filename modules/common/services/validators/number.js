module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = undefined !== schema.default ? schema.default : undefined;

            return def ? this._parseNumber(def) : (schema.nullable ? null : undefined);
        }

        if (isNaN(data)) {
            throw new Error('Value is not a number');
        }

        return this._parseNumber(data);
    },

    parse(data, schema) {
        return this.validate(data, schema);
    },

    _parseNumber(number) {
        return Number.isInteger(number) ? parseInt(number) : parseFloat(number);
    },
};