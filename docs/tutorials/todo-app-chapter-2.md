---
{
    "prev": "tutorials/todo-app-chapter-1",
    "metaDescription": "In this 2 part tutorial series we'll be running through how to build a small, full-stack, Todo App."
}
---

# Todo App: Chapter 2
::: subtitle
Building the UI
:::

![Banner](/tutorials/todo-app/final.png)

In this 2 part tutorial series we'll be running through how to build a small, full-stack, Todo App. In [Chapter 1][1] we learned how to setup a basic (unauthenticated) API with 5 routes provided by the Origami Resource. In this chapter we'll focus on building a UI with Origami's [Zen Components][2] and bundling our app with [Rollup][3] and [Sass][4].

This example app can be installed with the CLI using:
```bash
origami example todo-app
```

> ## Requirements
> This tutorial requires:
> - [Todo App - Chapter 1](/tutorials/todo-app-chapter-1) (setting up the API)
> - [The Origami CLI](https://github.com/origami-cms/cli)
> - [Postman](https://www.getpostman.com) (or something similar)

---

## Setting up the build process

Our front-end will consist of 3 main things:
- Our styling (Sass compiled into CSS)
- Our HTML (`./public/index.html`)
- Our JS (bundled from `./src` with Rollup)

### 1. Getting Sass working

For our styles, we're going to use the [zen-css][5] library compiled with Sass, however feel free to use any library/framework you're comfortable with.
Let's install these with:
```bash
yarn add -D node-sass zen-css
```

Then, create a file under `./src/sass/todo-app.scss` with:

```scss {data-filename=./src/sass/todo-app.scss}
@import 'zen-css/base';
```

This will import the `zen-css` base library. To build this, open your `package.json` and add into `scripts`:

```js {data-filename=./package.json}
{
    // ...
    "scripts": {
        "build:sass": "node-sass src/sass/ -o public/ --include-path ./node_modules"
    }
    // ...
}
```

If you now run `yarn build:sass` you should see the `todo-app.css` sitting in your `public` folder.


### 2. Serving static files in Origami

You may be asking how we serve static files in Origami. Simply add a path to the `server.static` option in your `.origami` file.
EG:
```js {data-filename=.origami}
{
    // ...
    "server": {
        "static": "./public"
    }
    // ...
}
```

Now, anything in this directory will be served directly from your app. Try loading [http://localhost:9999/todo-app.css](http://localhost:9999/todo-app.css) in your browser.

For the HTML file, add it under `./public/index.html` so it's the default page that Origami loads.

```html {.line-numbers data-filename=./public/index.html}
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Origami example - Todo App</title>
    <link rel="stylesheet" href="/todo-app.css">
    <script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.0.0/webcomponents-loader.js"></script>
</head>

<body>
    <zen-icon-set></zen-icon-set>

    <div class="todo center card">
        <header>
            <h3>Todo List</h3>
        </header>
        <ul class="todo-items"></ul>
        <zen-input class="new-todo" placeholder="Your next task…"></zen-input>
    </div>

    <script src="/todo-app.min.js"></script>
</body>

</html>
```

Note the `webcomponents-loader.js`. This is a polyfil for browsers that don't yet natively support Web Components. You can read more about it [here][6]. We've also included the `<zen-icon-set>`, allowing us to use all the icons from [origami-icons][7].

### 3. Javascript
Finally, we need to setup bundling for our Javascript, then we'll be ready to build our app. There are many great compilers and bundlers, but for simplicity Rollup was chosen in this series (you could very easily use Webpack or another tool). Let's install rollup and some plugins for handling node modules with:
```bash
yarn add -D rollup rollup-plugin-commonjs rollup-plugin-node-resolve
```

We're also going use be using `origami-zen` for our component library, so feel free to install that too with:
```bash
yarn add -D origami-zen
```

The two files we'll need is the `./rollup.config.js` and our `./src/todo-app.js` (file to bundle). Lets add these:

```js {.line-numbers data-filename=./rollup.config.js}
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/todo-app.js',
    dest: 'public/todo-app.min.js',
    format: 'iife',

    plugins: [resolve(), commonjs()]
};
```

```js {.line-numbers data-filename=./src/todo-app.js}
// Import only the components we need from Zen
import 'origami-zen/components/IconSet/IconSet';
import 'origami-zen/components/Icon/Icon';
import 'origami-zen/components/Checkbox/Checkbox';
import 'origami-zen/components/Input/Input';
import 'origami-zen/components/Button/Button';
```

As we did with our Sass styles, let's add a build task to bundle Rollup:

```js {data-filename=./package.json}
{
    // ...
    "scripts": {
        "build:sass": "node-sass src/sass/ -o public/ --include-path ./node_modules",
        "build:js": "rollup -c"
    }
    // ...
}
```

Now, if you run `yarn build:js` it will bundle the Javascript from `./src/tood-app.js` into our public directory. If you refresh the page at [http://localhost:9999/](http://localhost:9999/), you should see a basic page like this:

![Basic Todo App](/tutorials/todo-app/basic.png)

Great! We're up and running and are now ready to start adding some functionality to the app.

---

## Our first todo item

For this step, let's add some basic functionality of adding a new todo item when we enter something into the text field and press enter. We'll need a way of capturing the user's input and posting data to our API from the [previous chapter][1].

In `./src/todo-app.js`, add following lines to setup our base `TodoList` class.

```js {.line-numbers data-filename=./src/todo-app.js data-start=7}
// ...

class TodoList {
    constructor(container) {
        // Wrapping container for app
        this.container = document.querySelector(container);
        // UL list for all items
        this.todoList = this.container.querySelector('ul.todo-items');
        const template = document.querySelector('template#todo-item');
        // Template to clone for each item
        this.template = document.importNode(template.content, true);
        // API prefix for fetch()
        this.API = '/api/v1';

        this.setup();
        this.getItems();
    }

    // Sets up adding a new item for the text field when 'Enter' is pressed
    setup() {}

    // Retrieve a list of the items, then adds them into the list
    async getItems() {}

    // Adds a new todo item to the list, with event listeners and default values
    async addItemToList(item) {}

    // Creates a new todo item in the API, and adds the result to the list
    async createItem(text) {}

    // Saves an update in the API for a todo item
    async updateItem(id, data) {}

    // Toggles an item as completed or not completed, and saves in the API
    async checkoffItem(id, completed) {}

    // Removes an item from the list, and deletes in the API
    async removeItem(id) {}

    // Loops over all completed items and removes them
    async clearCompleted() {}

}

window.addEventListener('load', () => new TodoList('.todo'));
```

This will be our base class for our app. You could use any front-end library like [React][8] or [Angular][9] to build this, however for the simplicity of this series we'll just use plain ol' vanilla JS.

Note the `document.importNode(template.content, true)`. This will be our template for each todo item in our list. For this to work we'll need to add the template in our `./public/index.html`.

```html {.line-numbers data-filename=./public/index.html}
<!-- ... -->
<template id="todo-item">
    <li class="todo-item">
        <zen-checkbox></zen-checkbox>
        <zen-input></zen-input>
        <zen-icon type="cross" color="grey-200"></zen-icon>
    </li>
</template>
<!-- ... -->
```

Now, we can hook up the input field to creating an item. Add this to the `setup()` function in `./src/todo-app.js`:

```js {.line-numbers data-filename=./src/todo-app.js}
// ...
// Sets up adding a new item for the text field when 'Enter' is pressed
setup() {
    // Listen for enter key on input field to create new item
    this.container.querySelector('.new-todo')
        .addEventListener('keyup', e => {
            if (e.code !== 'Enter') return;
            this.createItem(e.target.value);
            // Reset the text field
            e.target.value = null;
        });
}
// ...
```

This code listens for the `Enter` key on the `zen-input` field, and adds the current text value as an item. Let's go ahead and set that function up too.

```js {.line-numbers data-filename=./src/todo-app.js}
// ...
// Adds a new todo item to the list, with event listeners and default values
async addItemToList(item) {
    // Clone the template
    const clone = this.template.cloneNode({deep: true});
    const li = clone.firstElementChild;

    // Set the ID (used for editing and removing)
    li.id = item.id;
    const input = li.querySelector('zen-input');
    const checkbox = li.querySelector('zen-checkbox');
    const remove = li.querySelector('zen-icon');

    // Set the initial values (completed, text, etc)
    input.value = item.text;
    input.disabled = Boolean(item.completed);
    checkbox.checked = Boolean(item.completed);
    li.classList.toggle('completed', Boolean(item.completed));


    // Setup listeners for text changing, clicking 'complete', and removing
    input.addEventListener('change', (e) => {
        this.updateItem(item.id, {text: e.target.value});
    });
    checkbox.addEventListener('change', (e) => {
        this.checkoffItem(item.id, e.target.checked);
    });
    remove.addEventListener('click', () => this.removeItem(item.id));

    // Finally, add it to the list
    this.todoList.appendChild(li);
}


// Creates a new todo item in the API, and adds the result to the list
async createItem(text) {
    const res = await fetch(`${this.API}/items`, {
        method: 'post',
        body: JSON.stringify({text}),
        headers: {'content-type': 'application/json'}
    }).then(r => r.json());

    this.addItemToList(res.data);
}
// ...
```

Now we have a way to add items into the DOM and a way to create them in the API. If we run `yarn build:js` again, then refresh in the browser, we should be able to add a new item by typing in the field and pressing `Enter`.

![First item](/tutorials/todo-app/first-item.png)

Nice! Well…perhaps if it looked a little better.

---

## Styling
Let's add some styling to the app in `./src/sass/todo-app.scss`

```scss
@import 'zen-css/base';

.todo {
    header {
        display: flex;
        h3 {
            flex-grow: 1;
        }
    }

    &.loading ul.todo-items:before {
        content: 'Loading…';
    }

    &.loaded ul.todo-items:empty:before {
        content: 'No items yet!';
    }

    ul.todo-items {
        position: relative;
        width: 30rem;
        height: 30rem;
        margin: var(--size-small) 0;
        overflow-y: auto;

        &:before {
            display: block;
            color: var(--color-grey-300);
            text-align: center;
            @extend %center;
        }

        li {
            position: relative;
            display: flex;
            align-items: center;
            margin-bottom: var(--size-tiny);
            animation: fade-in 1s ease-out;

            zen-checkbox {
                --checkbox-color-active: var(--color-grey-300);
            }
            zen-input {
                margin-left: var(--size-small);
                margin-right: var(--size-tiny);
                --input-height: var(--size-main);
            }

            &:before {
                content: '';
                position: absolute;
                left: 4rem;
                right: calc(100% - 4rem);
                top: 50%;
                height: 0.2rem;
                background: var(--color-grey-200);
                z-index: 100;
            }

            &.completed {
                & * {
                    opacity: 0.5;
                }
                &:before {
                    transition: all var(--transition-time);
                    right: 4rem;
                }
            }
        }
    }
}
```
You may notice there are quite a few extra styling rules in there. They'll make more sense once we start adding more features.
If we re-reun `yarn build:sass` and refresh the page, we'll have a…

![Disappeared](/tutorials/todo-app/disappeared.png)

Hold on, where did our first item go? We haven't told our app to load the existing items yet.

---

## Retrieving items

By updating the `getItems()` method, we can fetch the existing items to display when we load the app:

```js {.line-numbers data-filename=./src/todo-app.js}
// Retrieve a list of the items, then adds them into the list
async getItems() {
    // Set loading state
    this.container.classList.add('loading')

    // Get all the todo items from the Resource API
    const res = await fetch(`${this.API}/items`, {
        method: 'get',
        headers: {'content-type': 'application/json'}
    }).then(r => r.json());


    // Set the state
    this.container.classList.remove('loading');
    this.container.classList.add('loaded');

    // Loop over each item and add it to the list
    res.data.forEach(this.addItemToList.bind(this));
}
```

This function is automatically called in our `constructor()` so rebuild the JS (`yarn build:js`) and refresh the page.

![Back to normal](/tutorials/todo-app/disappear-fixed.png)

Phew! Back to normal. So what is this `getItems()` doing? First off it's adding the `loading` class to our app which, if you noticed in our Sass file, adds a loading state before the items are added. Then it grabs the existing items from our API created in the [previous chapter][1], and reads them as JSON. It loops over each item and reuses the `addItemToList()` function to insert them into the list. Once the items are added, it updates the loading state.

---

## Updating and completing items

Currently, we're able to edit and complete the items, however if we refresh the page they reset back to before. Let's add the updating functionality in the `updateItem()` and `checkoffItem()` methods:

```js {.line-numbers data-filename=./src/todo-app.js}
// ...
// Saves an update in the API for a todo item
async updateItem(id, data) {
    // Update the resource with a PUT request
    const res = await fetch(`${this.API}/items/${id}`, {
        method: 'put',
        body: JSON.stringify(data),
        headers: {'content-type': 'application/json'}
    }).then(r => r.json());

    return res.data;
}


// Toggles an item as completed or not completed, and saves in the API
async checkoffItem(id, completed) {
    const li = document.getElementById(id);
    li.classList.toggle('completed', completed);
    li.querySelector('zen-input').disabled = completed;

    // Save the updated item
    this.updateItem(id, {completed});
}
```

Let's also add an automatic way to watch for changes in our code, and automatically rebuild the Sass and JS.

```js {data-filename=./package.json}
{
    // ...
    "scripts": {
        "build:sass": "node-sass src/sass/ -o public/ --include-path ./node_modules",
        "build:js": "rollup -c",
        "watch": "yarn build:sass -w & yarn build:js -w"
    }
    // ...
}
```

Now, by running `yarn watch` the code compiles whenever we save. We can now complete items and update them in the API.

![Updated items](/tutorials/todo-app/updated.png)

---

## Removing and clearing completed items

The final part of our todo app is removing items, and clearing out the checked off items. Update the `removeItem()` and `clearCompleted()` methods:

```js {.line-numbers data-filename=./src/todo-app.js}
// Removes an item from the list, and deletes in the API
async removeItem(id) {
    // Delete the resource with a DELETE request
    const res = await fetch(`${this.API}/items/${id}`, {
        method: 'delete',
        headers: {'content-type': 'application/json'}
    }).then(r => r.json());

    // Remove the item in the API
    document.getElementById(id).remove();
}


// Loops over all completed items and removes them
async clearCompleted() {
    Array.from(this.container.querySelectorAll('li.completed'))
        .map(li => li.id)
        .forEach(this.removeItem.bind(this));
}
```

This code allows us to click on the 'X' button to delete and item, however for the clear button we need to first add it to the HTML.

```html {.line-numbers data-filename=./public/index.html}
<header>
    <h3>Todo List</h3>
    <zen-button class="padding-none" hollow="true" color="active">Clear</zen-button>
</header>
```

Finally we add the event listener in the `setup()` method:

```js {.line-numbers data-filename=./src/todo-app.js}
setup() {
    //...
    // Link clear button to removing all completed items
    this.container.querySelector('zen-button')
        .addEventListener('click', this.clearCompleted.bind(this));
}
```

## Conclusion

![Final](/tutorials/todo-app/final.png)
There you have it! A working Todo App built with Origami and Zen. As mentioned earlier, you could use any front end framework to interact with the Origami API, or a different CSS preprocessor (eg: LESS instead of SASS), or another type of database. Origami gives you the ultimate flexibility to write apps and websites using the technology you're comfortable with.



[1]: /docs/tutorials/todo-app-chapter-1
[2]: https://github.com/origami-cms/zen
[3]: https://rollupjs.org
[4]: https://sass-lang.com/
[5]: https://github.com/origami-cms/zen-css
[6]: https://www.webcomponents.org/polyfills
[7]: https://www.npmjs.com/package/origami-icons
[8]: https://reactjs.org
[9]: https://angularjs.org/
