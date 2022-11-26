import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';

class App extends React.Component {
  state = {
    data: null,
    token: null,
    baker: null
  };

  componentDidMount() {
    this.authenticateBaker();
  }

  authenticateBaker = () => {
    const token = localStorage.getItem('token');

    if(!token) {
      localStorage.removeItem('baker');
      this.setState({baker: null});
    }

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      }

      axios.get('http://localhost:5000/api/auth', config)
        .then((response) => {
          localStorage.setItem('baker', response.data.name);
          this.setState({baker: response.data.name});
        })
        .catch((error) => {
          localStorage.removeItem('baker');
          this.setState({baker: null});
          console.erorr(`Error logging in: ${error}.`)
        })
    }
  };

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('baker');
    this.setState({baker: null, token: null});
  };

  render() {
    let {baker, data} = this.state;
    const authProps = {
      authenticateBaker: this.authenticateBaker
    }
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
                {baker ? (
                  <Link to="" onClick={this.logout}>Logout</Link> 
                  ) : (
                  <Link to="/login">Login</Link>
                )}
              </li>
            </ul>
          </header>
          <main>
            <Switch>
              <Route exact path="/">
                {baker ? (
                    <React.Fragment>
                      <h2>Welcome {baker}!</h2>
                      <p>{data}</p>
                    </React.Fragment>
                    ) : (
                    <React.Fragment>
                      <h2>Welcome!</h2>
                      <p>Please register or login to save recipes.</p>
                    </React.Fragment>
                  )}
              </Route>
              <Route exact path="/register" render={() => <Register {...authProps}/>} />
              <Route exact path="/login" render={() => <Login {...authProps}/>} />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

export default App;
