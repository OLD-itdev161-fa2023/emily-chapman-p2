import React from 'react';
import axios from "axios";
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';

class App extends React.Component {
  state = {
    data: null
  }

  componentDidMount() {
    axios.get('http://localhost:5000')
      .then((response) => {
          this.setState({
            data: response.data
          })
        })
        .catch((error) => {
          console.error(`Error fetching data: ${error}`);
        })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1><Link to="/">SweetTooth</Link></h1>
            <ul>
              <li>
                <Link to="/register">Register</Link>
              </li>
              <li>
                <Link to="/signin">Sign In</Link>
              </li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route exact path="/">
                {this.state.data}
              </Route>
              <Route exact path="/register">
                <h2>Register</h2>
              </Route>
              <Route exact path="/signin">
                <h2>Sign In</h2>
              </Route>
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
