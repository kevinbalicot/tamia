module.exports = {
    validate(data, schema) {
        if (undefined === data || null === data) {
            const def = undefined !== schema.default ? schema.default : undefined;

            return def ? parseInt(def) : (schema.nullable ? null : undefined);
        }

        if (isNaN(data)) {
            throw new Error('Value is not a number');
        }

        return parseInt(data);
    },

    parse(data, schema) {
        return this.validate(data, schema);
    },
};
