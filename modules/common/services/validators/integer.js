module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = schema.default || schema.example;

            return def ? parseInt(def) : null;
        }

        if (isNaN(data)) {
            throw new Error('Value is not a number');
        }

        return parseInt(data);
    },
};
