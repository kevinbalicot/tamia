module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = schema.default || schema.example;

            return def ? String(def) : null;
        }

        if (typeof data != 'string') {
            throw new Error('Value is not a string');
        }

        return String(data);
    },
}
