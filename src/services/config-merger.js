module.exports = {
    mergeComponents(...configs) {
        const result = { components: {} };
        for (let config of configs) {
            for (let componentName in config.components) {
                if (!result.components[componentName]) {
                    result.components[componentName] = {};
                }

                result.components[componentName] = Object.assign(result.components[componentName], config.components[componentName]);
            }
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
