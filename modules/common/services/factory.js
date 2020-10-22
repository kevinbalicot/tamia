module.exports = {
    /**
     * Create object from OpenAPI model
     *
     * @param {*} data
     * @param {Object} model
     * @return {Object}
     */
    createFromModel(data, model) {
        let newModel = {};

        if (!model.properties) {
            newModel = data;
        }

        for (let key in model.properties) {
            if (!model.properties.hasOwnProperty(key)) {
                continue;
            }

            if (model.required && model.required.includes(key) && !data[key]) {
                throw new Error(`Parameter "${key}" is required`);
            }

            const def = model.properties[key].default || model.properties[key].example || null;
            switch (model.properties[key].type) {
                case 'string':
                default:
                    newModel[key] = data[key] ? String(data[key]) : def;
                    break;
                case 'integer':
                    newModel[key] = data[key] ? parseInt(data[key]) : def;
                    break;
                case 'object':
                    newModel[key] = module.exports.createFromModel(data[key], model.properties[key]);
                    break;
                case 'array':
                    newModel[key] = (data[key] || []).map(item => module.exports.createFromModel(item, model.properties[key].items));
                    break;
            }
        }

        return newModel;
    },
};
