module.exports = {
    mergeComponents(...configs) {
        const result = { components: { schemas: {} } };
        for (let config of configs) {
            result.components.schemas = Object.assign(result.components.schemas, config.components.schemas);
        }

        return result;
    },

    mergePaths(...configs) {
        const result = { paths: {} };
        for (let config of configs) {
            result.paths = Object.assign(result.paths, config.paths);
        }

        return result;
    },
};
