---
{
    "next": "tutorials/todo-app-chapter-1"
}
---

# Getting started with Origami

**Welcome to Origami!** Origami is a incredibly simple yet very powerful platform to build websites, apps, API's, online stores, or whatever you can dream up. It put's the fun back into building on the web. Let's get started…

> ## Requirements
> To begin, you'll need:
> - Basic understanding of programming
> - Basic understanding of using Terminal or CMD (Windows)
> - A computer with [Node.js][1] installed

---

## Installation
Let's start first with installing [Origami's CLI](https://github.com/origami-cms/cli) (Command Line Interface). This a very nifty tool that's like a Swiss Army Knife for building and deploying your sites with Origami.

If you have Node (with NPM) or [Yarn](https://yarnpkg.com) installed, simply run:

```bash
npm install -g origami-cli
```

or

```bash
yarn global add origami-cli
```

This will now have installed `origami` that you can run from anywhere in the terminal. That's all you need!

---

## Hello, World
As is tradition, let's get a simple Hello, World up and running by only typing two lines of code. Don't believe it? Try this:

```bash
origami example hello-world
origami hello-world/ -o
```

![Hello, World](https://raw.githubusercontent.com/origami-cms/example-hello-world/master/banner.jpg)

You should automatically see something like this in your browser now! So what's going on? Let's break it down.
The first command copies down the example `hello-world` app into a new folder.
We then run `origami` on that folder, where the CLI reads the `.origami` file, and opens it in the browser with the `-o` flag. Pretty neat huh?

You can view the code for this example at the [Github repository](https://github.com/origami-cms/example-hello-world)


[1]: https://nodejs.org/en/download/
