You want to create something awesome in TypeScript, so you set up a nice little directory structure:

![A cool project](https://thepracticaldev.s3.amazonaws.com/i/n7fg9d06avscgdmky8ow.png)

You want to support older versions of node, so you set up your typescript compiler accordingly:

```json
{
  "compilerOptions": {
    "target": "es5",
    "sourceMap": true,
    "outDir": "dist",
    "moduleResolution": "node"
  },
  "exclude": [
    "node_modules"
  ],
  "files": [
    "src/index.ts"
  ]
}
```

But wait!

![dun dun dunn!](https://thepracticaldev.s3.amazonaws.com/i/688qlffher0prdnmopmo.png)

What do you mean I can't use promises? I don't want to import a polyfill, it'd pollute my nice `index.ts`! If I change to ES6, I get ESM import statements. I can't use those in node!

# Enter Gulp and Babel

There's a better way. We can use Gulp. It's a task runner. It runs tasks.

```zsh
yarn add --dev gulp gulp-babel gulp-jsdoc3 gulp-sourcemaps gulp-typescript babel-preset-env
```

_Note: you can replace `yarn add --dev` with `npm install --save-dev`_

Now that we've got Gulp, we can take the ES6 output from TypeScript and polyfill that to whatever version we want to support using `babel-preset-env`.

**Here's the part you were probably looking for:**

For this, we need to set up two files: `gulpfile.js` and `.babelrc`. We'll also amend our `tsconfig.json`.

```js
// gulpfile.js
const gulp = require('gulp');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const tsProj = ts.createProject('tsconfig.json');

gulp.task('build', () => {
  gulp.src('src/**/*.ts')
    .pipe(sourcemaps.init())
    .pipe(tsProj())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);
```

```json
// .babelrc
{
  "presets": [
    ["babel-preset-env", {
      "targets": {
        "node": "6.10"
      }
    }]
  ]
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "es6",
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "outDir": "dist",
    "moduleResolution": "node"
  },
  "exclude": [
    "node_modules"
  ],
  "files": [
    "lib/index.ts"
  ]
}
```

And our final directory structure:

![finally!](https://thepracticaldev.s3.amazonaws.com/i/ctz98wqy60tp9vf6xmx9.png)

To build, we simply run: `npx gulp`, which runs Gulp.

# An Explanation
If you were scouring Google for a solution on how to do this, and you've got other stuff to fix, this part isn't for you. If you want to understand what we've just done, stick with me.

## Gulp
We use Gulp as the heart of our build. It's a task runner, which means that we can get it to do all sorts of things. Compile SASS, create JSDoc, and even compile TypeScript. 

Our Gulp 'build' command does the following:

* Get all of our TypeScript files: `gulp.src('src/**/*.ts')`
* Begin a sourcemap (ideal for debugging in VS Code): `.pipe(sourcemaps.init())`
* Compile the TypeScript (Using our tsconfig defined earlier): `.pipe(tsProj())`
* Pass the compiled code through Babel: `.pipe(babel())`
* Finish our sourcemap: `.pipe(sourcemaps.write('.'))`
* Stick out output in 'dist/': `.pipe(gulp.dest('dist'));`

## Babel
We use `.pipe(babel())` to run our code through Babel. Babel polyfills. If no arguments are passed, it looks for `.babelrc`.

Our `.babelrc` uses `babel-preset-env`, a fairly new preset for Babel. It's fantastic - all you need to do is provide a version to polyfill* for. More on preset-env [here](https://babeljs.io/docs/plugins/preset-env/).

*A polyfill, or polyfiller, is a piece of code (or plugin) that provides the technology that you, the developer, expect the browser (read: interpreter) to provide natively - [source](https://remysharp.com/2010/10/08/what-is-a-polyfill)

## npx
npx is a powerful tool that essentially lets you run programs from your `node_modules/`. Try it with eslint! `yarn add eslint && npx eslint --init`. It'a sometimes easier if you don't want that binary installed permanently on your system.


I hope this was somewhat informative! It was a total adventure getting this set up for the first time today!