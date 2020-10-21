# Configuration

## General configuration

The general configuration is available into `config/config.json` file.

```json
# config/config.json
{
    "api": {
        "openapi": "3.0.1",
        "info": {
            "version": "1.3.0",
            "title": "Tamia",
            "description": "Tamia API demo",
            "termsOfService": "http://api_url/terms/",
            "contact": {
                "name": "Tamia Team",
                "email": "hello@tamia.com",
                "url": "https://tamia.com/"
            },
            "license": {
                "name": "Apache 2.0",
                "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
            }
        },
        "tags": []
    },

    "models": [
        "/config/models/hello.json"
    ],

    "routes": [
        "/config/routes/hello.json"
    ],

    "controllers": [
        "/src/controllers/hello"
    ]
}
```

### API info

You can edit some OpenAPI information under `api` section.

### Models

You can add new models under `models` section. File use root directory (same place of server.js file) when it's include. But you can juste put new models into `config/models` directory.

Model file have to be OpenAPI v3 component compatible

```json
# config/models/hello.json

{
    "components": {
        "schemas": {
            "Hello": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string"
                    }
                }
            }
        }
    }
}
```

### Routes

You can add some routes under `routes` section. File use root directory (same place of server.js file) when it's include. But you can juste put new models into `config/routes` directory.

Route file have to be OpenAPI v3 path compatible

```json
# config/routes/hello.json

{
    "paths": {
        "/hello": {
            "get": {
                "description": "Get hello",
                "operationId": "getHello",
                "parameters": [],
                "responses": {
                    "200": {
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schema/Hello"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
```

WARNING: Every route (`GET /hello` for example) need a operationId !

### Controllers

You can add new controllers under `controllers` section. File use root directory (same place of server.js file) when it's include. But you can juste put new models into `src/controllers` directory.

Controller need to be a module with method matching operationId Route.

```js
// src/controller/hello.js

module.exports = {
    getHello(req, res) {
    
        res.setHeader('Content-Type', 'application/json');
        res.statusCode = 200;
        
        return res.end(JSON.stringify({ message: 'Hello World!' }));
    },
}
```
