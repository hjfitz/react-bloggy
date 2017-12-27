// where we're going to render our react
const entry = document.getElementById('react');

// get the contents of a file
// TODO: point this to the repos 'entries' folder
const getNav = () => fetch('https://api.github.com/repos/hjfitz/contentful-redis/contents').then(resp => resp.json());

class Article extends React.Component {
  constructor(props) {
    super(props);
  }

  renderMarkdown() {

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
      .map(file => ({
        name: file.name,
        url: file.html_url,
      })).map(({ url, name }) => {
        const link = React.createElement('a', { href: url, key: url }, name);
        const listItem = React.createElement('li', null, link);
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
ReactDOM.render(React.createElement(Navigation, null, null), entry);