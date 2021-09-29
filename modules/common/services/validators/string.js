module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = undefined !== schema.default ? schema.default : undefined;

            return def ? String(def) : (schema.nullable ? null : undefined);
        }

        if (typeof data != 'string') {
            throw new Error('Value is not a string');
        }

        return String(data);
    },

    parse(data, defaultValue = undefined) {
        return module.exports.validate(data, { default: defaultValue });
    },
}
