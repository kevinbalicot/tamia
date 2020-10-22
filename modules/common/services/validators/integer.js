module.exports = {
    validate(data, schema) {
        if (!data) {
            const def = schema.default || schema.example;

            return def ? parseInt(def) : null;
        }

        if (typeof data != 'number') {
            throw new Error('Value is not a number');
        }

        return parseInt(data);
    },
};
