![logo](doc/media/logo.png)

# TAMIA

A REST API Server designed with Open API v3

## Installation

```
$ npm install --save @tamia/tamia
```

With connect or express js

```js
const tamiaApi = require('@tamia/tamia');

// ...
const config = { ... }; // Open API schema, see documentation for more info
const options = { ... }; // Tamia API options
const tamia = tamiaApi(config, options);

app.use(tamia.request);
```

### Documentation

Summary

- [CONFIGURATION](/doc/CONFIGURATION.md)
- [PLUGINS](/doc/PLUGINS.md)

### Tests

```
$ npm test
```
