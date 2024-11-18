const assert = require('assert');
const factory = require('../../../../../yion/api/factory');

describe('Factory service', () => {
    describe('createFromModel()', () => {
        it('should create object from model', () => {
            const model = {
                properties: {
                    name: {
                        type: 'string',
                    },
                    quantity: {
                        type: 'integer',
                    },
                    private: {
                        type: 'boolean',
                    }
                }
            };

            const data = { name: 'foo', quantity: 2, foo: 'bar', private: 1 };
            const expected = { name: 'foo', quantity: 2, private: true };

            assert.deepStrictEqual(factory.createFromModel(data, model), expected);
        });

        it('should throw error when required data is empty', () => {
            const model = {
                required: ['quantity'],
                properties: {
                    name: {
                        type: 'string',
                    },
                    quantity: {
                        type: 'integer',
                    },
                    private: {
                        type: 'boolean',
                    }
                }
            };

            const data = { name: 'foo' };

            assert.throws(() => factory.createFromModel(data, model), Error);
        });

        it('should create object from model with default values', () => {
            const model = {
                properties: {
                    name: {
                        type: 'string',
                        default: 'foo',
                    },
                    quantity: {
                        type: 'integer',
                        default: 2,
                    },
                }
            };

            const expected = { name: 'foo', quantity: 2 };

            assert.deepStrictEqual(factory.createFromModel({}, model), expected);
        });

        it('should create empty object from model', () => {
            const model = {
                properties: {
                    name: {
                        type: 'string',
                    },
                    quantity: {
                        type: 'integer',
                    },
                }
            };

            const expected = {};

            assert.deepStrictEqual(factory.createFromModel({}, model), expected);
        });

        it('should create empty object with default data from model', () => {
            const model = {
                properties: {
                    name: {
                        type: 'string',
                        default: null,
                    },
                    quantity: {
                        type: 'integer',
                        default: null,
                    },
                }
            };

            const expected = {};

            assert.deepStrictEqual(factory.createFromModel({ name: null, quantity: null }, model), expected);
        });

        it('should create object from model with deep model', () => {
            const model = {
                properties: {
                    name: {
                        type: 'string',
                    },
                    comment: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                            },
                            content: {
                                type: 'string',
                            },
                            private: {
                                type: 'boolean',
                            }
                        }
                    }
                }
            };

            const data = { name: 'foo', foo: 'bar', comment: { username: 'john', content: 'hello', stars: 5, private: 0 } };
            const expected = { name: 'foo', comment: { username: 'john', content: 'hello', private: false } };

            assert.deepStrictEqual(factory.createFromModel(data, model), expected);
        });

        it('should create empty object from model with array', () => {
            const model = {
                properties: {
                    letters: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                }
            };

            const data = { letters: ['A', 'B', 'C'] };
            const expected = { letters: ['A', 'B', 'C'] };

            assert.deepStrictEqual(factory.createFromModel(data, model), expected);
        });

        it('should create empty object from model with array of objects', () => {
            const model = {
                properties: {
                    words: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                word: {
                                    type: 'string',
                                },
                                private: {
                                    type: 'boolean',
                                }
                            }
                        }
                    },
                }
            };

            const data = { words: [{ word: 'foo', private: true }, { word: 'bar', private: 0 }] };
            const expected = { words: [{ word: 'foo', private: true }, { word: 'bar', private: false }] };

            assert.deepStrictEqual(factory.createFromModel(data, model), expected);
        });
    });
});
