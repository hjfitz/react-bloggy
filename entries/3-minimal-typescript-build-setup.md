I mentioned in the last 'post' about using `gulp` and `babel` with `tsc` for a nice little typescript setup. This is a huge overhead if you're just playing about - who wants to set that up?

Not me.

I recently found out that TS had a little CLI tool - let's set up a project with this.

# Initial Project Setup
Of course, we'll firstly set up a node project:

```zsh
yarn init -y
```

Then, we'll install what we need:
```zsh
yarn add --dev typescript @types/node
```

And that's all - no gulp, no babel-env. Pretty light. 

# TypeScript Project Setup

`//todo`
