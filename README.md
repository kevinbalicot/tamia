![logo](doc/media/logo.png)

# TAMIA

A REST API Server

## Installation

```
$ npm install --save @tamia/tamia
```

With connect or express js

```js
const tamiaApi = require('@tamia/tamia');

// ...
const config = { ... }; // Open API schema, see documentation for more info

app.use(tamiaApi(config));
```

### Documentation

Summary

- [CONFIGURATION](/doc/CONFIGURATION.md)


### Tests

```
$ npm test
```
