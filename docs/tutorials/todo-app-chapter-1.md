---
{
    "title": "Todo App: Chapter 1",
    "prev": "tutorials/getting-started",
    "next": "tutorials/todo-app-chapter-2"
}
---

# Todo App: Chapter 1
::: subtitle
Setting up the API
:::

![Banner](/tutorials/todo-app/final.png)

In this 2 part tutorial series we'll be running through how to build a small, full-stack, Todo App (as is customary for most frameworks). Origami comes with it's own UI library called [Zen](https://github.com/origami-cms/zen), a collection of highly reusable and theme-able [Web Components](https://www.webcomponents.org/). We like Web Components at Origami because they're agnostic to frameworks but you could use any front end library (React, Vue, Angular, etc). We'll also be using [Origami's Resource feature][1] to quickly scale a REST API for our app.

This example app can be installed with the CLI using:
```bash
origami example todo-app
```

> ## Requirements
> This tutorial requires:
> - [The Origami CLI](https://github.com/origami-cms/cli)
> - [Postman](https://www.getpostman.com) (or something similar)

---

## Getting setup
To begin, setup a new Origami project with the CLI using:

```bash
origami new todo-app
```

This will run through some basic questions about your app, name, store details, etc.
By the end, you should have a new folder called `todo-app`, with an `.origami` file that looks a little something like this:

```js {.line-numbers data-filename=.origami}
{
    "app": {
        "name": "origami-example-todo-app"
    },
    "server": {
        "port": 9999,
        "secret": "e5df1ac2da01ed785685dbd75ec74ba6"
    }
}
```

If you run `origami -o` in the new directory, you'll get the default Origami welcome page.

![Origami Default Page](/tutorials/todo-app/default.png)

When you reach this screen, it means everything was setup and installed correctly 🙌.

---

## Setting up the store (database)
Origami is very flexible, allowing you to connect to any database that has an adapter. Current adapters include:
- [MongoDB](http://mongodb.com)
- [MySQL](https://www.mysql.com/)
- [Postgres](https://www.postgresql.org/)
- [SQLite](https://www.sqlite.org/index.html)
- [LowDB](http://thanks.typicode.com/lowdb/)

For our example Todo App we'll use LowDB because it requires no setup (just a JSON file with all your data).
To use a store in Origami, first install the adapter:

```base
yarn add origami-store-lowdb
```

From here, add the connection details in your `.origami` file and away you go! (For more information on how to setup other databases, you can read the API reference for [Stores][2] and [the Origami file][3]). Origami also allows you to pass in environment variables so you don't store secure information (such as passwords, connection strings etc) in the code. For more information, check out the [the Origami file][3] API reference.

```js {data-filename=.origami}
{
    // ...
    "store": {
        "type": "lowdb",
        "database": "./todo-db.json"
    }
    // ...
}
```

If you re-run `origami` in your terminal, you should see the `todo-db.json` file show up. This contains all the data for our Todo App. In a real world scenario we would use a more complex database hosted on a remote server, however for this tutorial, LowDB works well.

---

## Setting up the resources
Resources in Origami respresent types of data that we can interact with via the Store and the API. Setting one up in Origami is as easy as defining what the data looks like, and then just adding it to the `.origami` file.

For our Todo App we're only going to use one model — the `TodoItem`. In your project, under a new folder called `resources`, add a file called `TodoItem.js`:

```js {.line-numbers data-filename=./resources/TodoItem.js}
module.exports = {
    properties: {
        id: "uuid",
        text: {type: "string", required: true},
        completed: {type: 'boolean', default: false}
    }
}
```

Once this file is added, hooking it up to an API has never been easier. In your `.origami` file, add:

```js {data-filename=.origami}
{
    // ...
    "resources": {
        "item": {
            "model": "./resources/TodoItem.js",
            "auth": false
        }
    }
    // ...
}
```

Now if you load [http://localhost:9999/api/v1/items](http://localhost:9999/api/v1/items), you should receive:
```json
{
    statusCode: 200,
    message: "Successfully retrieved resources",
    data: []
}
```

### So…what is this doing?
The `.origami` file is setting up a special resource with the model `TodoItem.js` that you defined, and **automatically giving you 5 API REST calls** ([read more about Resources here][1]) you can make to access your Todo Items. By default, authentication is required for each of these API calls, but we turned this off for simplicity's sake in this tutorial.

We now have a working, un-authenticated API with:

- `GET /api/v1/items` to get a list of our todo items
- `POST /api/v1/items` to create a todo item
- `GET /api/v1/items/:id` to get an individual todo item
- `PUT /api/v1/items/:id` to update a todo item
- `DELETE /api/v1/items/:id` to delete a todo item

Have a play around in Postman and try to create an item (`POST /api/v1/items`) with the JSON format we defined in `./resources/TodoItem.js`. You can also update, delete and get a list of the items you create by accessing each of the routes created by the Resource.

---

## Next steps

Thus far, we've learned how to use the CLI and `.origami` file to setup a basic API with 5 routes. Next up we will build out the UI to communicate with our API.


[1]: /docs/api-reference/resources
[2]: /docs/api-reference/stores
[3]: /docs/api-reference/the-origami-file
