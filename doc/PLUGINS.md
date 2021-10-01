# Plugins

## Create plugin

A plugin is a function with request, response and next plugin parameters, for exemple :

```
const plugin = function(req, res, next) {
    // Do stuff
    
    next(); // Call next plugin
};
```

You can access to API config like this :

```
const plugin = function(req, res, next) {
    const api = this.api // Do stuff with API Config
    
    if (req.url === '/doc') {
        res.setHeader('Content-Type', 'application/json');

        return res.end(JSON.stringify(this.api));
    }
    
    next();
};
```

You can add your plugin like this :

```
const tamiaApi = require('@tamia/tamia');

const middleware = tamiaApi(
    apiConfig,
    {
        plugins: [plugin]
    }
);
```

## List of plugins

- :pencil: Doc plugin `@tamia/doc-plugin`
