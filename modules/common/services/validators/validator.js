const stringValidator = require('./string');
const integerValidator = require('./integer');
const booleanValidator = require('./boolean');
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
        const getDefaultFromSchema = (schema, defaultValue = null) => {
            let value = undefined !== schema.default ? schema.default : undefined;

            return undefined === value && schema.nullable ? defaultValue : value;
        };

        let model = {};
        for (let key in schema.properties) {
            if (!schema.properties.hasOwnProperty(key)) {
                continue;
            }

            if (
                (Array.isArray(schema.required) && schema.required.includes(key) && !data[key]) ||
                (schema.required === true && !data[key])
            ) {
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
                    case 'boolean':
                        model[key] = booleanValidator.validate(value, schema.properties[key]);
                        break;
                    case 'object':
                        if (!value) {
                            model[key] = getDefaultFromSchema(schema.properties[key]);
                            break;
                        }
                        model[key] = module.exports.validate(value, schema.properties[key]);
                        break;
                    case 'array':
                        if (!value) {
                            model[key] = getDefaultFromSchema(schema.properties[key], []);
                            break;
                        }
                        model[key] = value.map(item => module.exports.validate(item, schema.properties[key].items));
                        break;
                }

                // Cleaning model
                if (model[key] === undefined) {
                    delete model[key];
                }
            } catch (e) {
                throw new BadRequest(`Parameter "${key}": ${e.message}`);
            }
        }

        return model;
    }
}
