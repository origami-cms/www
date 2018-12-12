# The .origami file

One of the way Origami revolutionizes the way we build for the web is putting as much as possible (if not everything!) into one file.
Why does this matter? It makes developing, scaling and distributing your sites and apps much simpler allowing you to focus on what really matters. In one place, you can see your entire architecture, plugins, apps, databases, and more.

## What it looks like

```json
// Example .origami file
{
    // Settings for the overall project
    "app": {
        "name": "My Web App",
        "url": "app.origami.so"
    },

    // Settings for the store / database
    "store": {
        // Store / Database type to integrate with
        "type": "mongodb",
        // Store / Database hostname to connect with
        "host": "mydatabase.com",
        // Store / Database port to connect with
        "port": "1207",
        // Store / Database db name to connect with
        "database": "origami-app",
        // Store / Database username to connect with
        "username": "origami",
        // Store / Database password to connect with
        "password": "secret"
    },

    // Settings for the server setup
    "server": {
        // Secret code to encrypt data and authentication tokens with
        "secret": "a2rn3n2g00035mcq",
        // Port number to run the server on
        "port": "9999",
        // Server language
        "ln": "en",
        // Static directories to serve
        "static": "./public"
    },

    // Model / Controller resources to automatically create
    "resources": {
        "customer": "./resources/customer.js",

        "image": {
            "model": "./resources/image.js",
            "auth": false
        },

        "product": {
            "model": "./resources/product.js",
            "auth": {
                "get": false,
                "list": false,
                "post": true,
                "put": true,
                "delete": true
            }
        }
    },

    // Plugins to integrate into Origami
    "plugins": {
        "contact-form": true,
        "spa": {"fallback": "./dist/index.html"},
        "google-analytics": {"gaCode": "134F-KKA0-42NU-2664"},
    },

    // Add controllers by individual files or directories
    "controllers": {
        "./routes/": "/my-api"
    },

    // Applications to install into Origami
    "apps": {
        "admin": true,
        "theme": "snow",
        "wysiwyg": true
    }
}
```
