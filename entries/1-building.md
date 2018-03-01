# Inspiration

I love github pages. I also love writing React. I really *dislike* setting up a build environment for react - which is while I created this beautiful [boilerplate](https://github.com/hjfitz/PWA-Boilerplate). It's my baby, and you should definitely fork it.

Because I wanted to toy with React, without and transpilation, I decided to write a wrapper around Github's API, with React. Sans JSX. This reps aims to show how *simple* it is to code in React, without any babel/webpack/jsx fuckery.

# Architecture
## Github
I use Github pages to host three files: `index.html`, `main.js` and `style.css`. Obviously, `index.html` pulls in the other two. The really interesting part here is how we pull data from github.

Github has an [open Restful API](https://developer.github.com/v3/) (it also supports GraphQL!). I make use of this for one thing: Navigation. I fire off a request to see what's in this repository - under entries:

```js
const getNav = () => fetch('https://api.github.com/repos/hjfitz/react-bloggy/contents/entries').then(resp => resp.json());
```

I get a response like this:
```js
[
  {
    name: "1-building.md",
    path: "entries/1-building.md",
    sha: "01a9b6b36419fda0ce7626966d1a9566f2a6df2d",
    size: 361,
    url: "https://api.github.com/repos/hjfitz/react-bloggy/contents/entries/1-building.md?ref=master",
    html_url: "https://github.com/hjfitz/react-bloggy/blob/master/entries/1-building.md",
    git_url: "https://api.github.com/repos/hjfitz/react-bloggy/git/blobs/01a9b6b36419fda0ce7626966d1a9566f2a6df2d",
    download_url: "https://raw.githubusercontent.com/hjfitz/react-bloggy/master/entries/1-building.md",
    type: "file",
    _links: {
      self: "https://api.github.com/repos/hjfitz/react-bloggy/contents/entries/1-building.md?ref=master",
      git: "https://api.github.com/repos/hjfitz/react-bloggy/git/blobs/01a9b6b36419fda0ce7626966d1a9566f2a6df2d",
      html: "https://github.com/hjfitz/react-bloggy/blob/master/entries/1-building.md"
    }
  }
]
```

I slim it down to this:

```js
[
  {
    name: "1-building.md",
    download_url: "https://raw.githubusercontent.com/hjfitz/react-bloggy/master/entries/1-building.md",
  }
]
```

And generate navigation based on this. There's some fancy parsing arond the name, but when I generate a navitem, I give it a listener for a click. When this happens, I fetch `download_url` and parse to text. This goes through `marked`, and I render it! 

# Future?
Blogging is something that'll help me turn technical terms in to less-than-technical terms.

I'll also likely post these to [The Practical Dev](https://dev.to/hjfitz), too!