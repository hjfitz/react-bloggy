// where we're going to render our react
const entry = document.getElementById('react');

// get all of the bloggy entries
const getNav = () => fetch('https://api.github.com/repos/hjfitz/react-bloggy/contents/entries').then(resp => resp.json());

class Article extends React.Component {
  constructor(props) {
    super(props);
    // set to a placeholder soon
    this.state = { url: '' };
    this.renderMarkdown = this.renderMarkdown.bind(this);
  }

  async renderMarkdown(url) {
    const entry = await fetch(url).then(resp => resp.text());
    const md = marked(entry);
    this.setState({ md });
  }

  render() {
    const { md } = this.state;
    // set inner HTML to parsed md
    const entryProps = { dangerouslySetInnerHTML: { __html: md }, key: 'article' }
    // create a callback handler for navigation click
    const navProps = { callback: this.renderMarkdown, key: 'nav' }

    // create react elements
    const entry = React.createElement('div', entryProps , null);
    const nav = React.createElement(Navigation, navProps , null);

    // render those elements within a div
    const container = React.createElement('div', { className: 'container' } , [ nav, entry ]);
    return container;
  }
}

// generate a nice navigation bar based on the files in our github repo
class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = { nav: [] };
  }

  // mounted?
  // get the entries and map them in to react elements
  async componentDidMount() {
    const files = await getNav();
    const nav = files
      .map(({ name, download_url }) => ({
        name: name,
        url: download_url,
      })).map(({ url, name }) => {
        const onClick = () => this.props.callback(url);
        const listItem = React.createElement('li', { key: url, onClick }, name);
        return listItem;
    });

    // set state to cause a re-render
    this.setState({ nav });
  }

  render() {
    // pull nav out of state to avoid and 'this' fuckery
    const { nav } = this.state;
    // put the items in a list
    const list = React.createElement('ul', null, nav);
    return list;
  }
}

// render the nav (temporarily)
ReactDOM.render(React.createElement(Article, null, null), entry);