module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = undefined !== schema.default ? schema.default : undefined;

            return def ? parseInt(def) : (schema.nullable ? null : undefined);
        }

        if (isNaN(data)) {
            throw new Error('Value is not a number');
        }

        return parseInt(data);
    },

    parse(data, defaultValue = undefined) {
        return module.exports.validate(data, { default: defaultValue });
    },
};
