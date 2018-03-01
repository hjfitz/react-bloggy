// where we're going to render our react
const entry = document.getElementById('react');

// get all of the bloggy entries
const getNav = () => fetch('https://api.github.com/repos/hjfitz/react-bloggy/contents/entries').then(resp => resp.json());

const capitalise = word => word.charAt(0).toUpperCase() + word.substring(1);

const parseName = name => name.replace('.md', '').replace('-', ' ').split(' ').map(capitalise).join(' ');

class Article extends React.Component {
  constructor(props) {
    super(props);
    // set to a placeholder soon
    this.state = { url: '' };
    // set up an instance of marked
    this.renderer = new marked.Renderer();
    
    // add custom classes to parsed elements
    this.renderer.list = (body, ordered) => 
      ordered 
        ? `<ol>${body}</ol>` 
        : `<ul class="collection">${body}</ul>`;
  
    this.renderer.listitem = text => `<li class="collection-item">${text}</li>`;

    this.renderMarkdown = this.renderMarkdown.bind(this);
  }

  async renderMarkdown(url) {
    const { renderer } = this;
    const entry = await fetch(url).then(resp => resp.text());
    const md = marked(entry, { renderer });
    this.setState({ md });
  }

  render() {
    const { md } = this.state;
    // set inner HTML to parsed md
    const entryProps = { dangerouslySetInnerHTML: { __html: md }, key: 'entry' };
    // create a callback handler for navigation click
    const navProps = { callback: this.renderMarkdown, key: 'nav' };

    // create react elements
    const entry = React.createElement('article', entryProps , null);
    const nav = React.createElement(Navigation, navProps , null);

    // react16 allows us to return a list, not items in a <div>
    if (md) return [entry, nav];
    return nav;
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
      .map(({ name, download_url }) => {
        const onClick = () => this.props.callback(download_url);
        const props = { key: download_url, onClick };
        const listItem = React.createElement('li', props, parseName(name));
        return listItem;
    });

    // render the most recent article
    nav[nav.length - 1].props.onClick()

    // set state to cause a re-render
    this.setState({ nav });
  }

  render() {
    // pull nav out of state to avoid and 'this' fuckery
    const { nav } = this.state;
    // put the items in a list
    const list = React.createElement('ul', null, nav);
    return React.createElement('nav', null, list);
  }
}

ReactDOM.render(React.createElement(Article), entry);