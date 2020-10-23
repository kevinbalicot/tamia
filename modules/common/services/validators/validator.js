const stringValidator = require('./string');
const integerValidator = require('./integer');
const BadRequest = require("../../errors/bad-request");

module.exports = {
    /**
     * Validate data with schema
     *
     * @param {*} data
     * @param {Object} schema
     * @return {Object}
     */
    validate(data, schema) {
        let model = {};
        for (let key in schema.properties) {
            if (!schema.properties.hasOwnProperty(key)) {
                continue;
            }

            if (schema.required && schema.required.includes(key) && !data[key]) {
                throw new BadRequest(`Parameter "${key}" is required`);
            }

            try {
                const value = data ? data[key] : null;
                switch (schema.properties[key].type) {
                    case 'string':
                    default:
                        model[key] = stringValidator.validate(value, schema.properties[key]);
                        break;
                    case 'integer':
                        model[key] = integerValidator.validate(value, schema.properties[key]);
                        break;
                    case 'object':
                        if (!value) {
                            model[key] = null;
                            break;
                        }
                        model[key] = module.exports.validate(value, schema.properties[key]);
                        break;
                    case 'array':
                        if (!value) {
                            model[key] = [];
                            break;
                        }
                        model[key] = value.map(item => module.exports.validate(item, schema.properties[key].items));
                        break;
                }
            } catch (e) {
                throw new BadRequest(`Error with "${key}" : ${e}`);
            }
        }

        return model;
    }
}
