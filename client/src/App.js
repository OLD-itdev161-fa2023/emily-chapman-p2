import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import './App.css';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import RecipeList from './components/RecipeList/RecipeList';
import Recipe from './components/Recipe/Recipe';

class App extends React.Component {
  state = {
    recipes: [],
    recipe: null,
    token: null,
    baker: null
  };

  componentDidMount() {
    this.authenticateBaker();
  };

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
      };

      axios.get('http://localhost:5000/api/auth', config)
        .then((response) => {
          localStorage.setItem('baker', response.data.name);
          this.setState(
            {
              baker: response.data.name,
              token: token
            },
            () => {
              this.loadData();
            }
          );
        })
        .catch((error) => {
          localStorage.removeItem('baker');
          this.setState({baker: null});
          console.error(`Error logging in: ${error}.`)
        })
    }
  };

  loadData = () => {
    const {token} = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios.get('http://localhost:5000/api/recipes', config)
        .then(response => {
          this.setState({
            recipes: response.data
          })
        })
        .catch(error => {
          console.error(`Error fetching data: ${error}.`);
        });
    }
  };

  viewRecipe = recipe => {
    console.log(`View ${recipe.title}`);
    this.setState({
      recipe: recipe
    });
  };

  deleteRecipe = recipe => {
    const {token} = this.state;

    if (token) {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };

      axios.delete(`http://localhost:5000/api/recipes/${recipe._id}`, config)
        .then(response => {
          const newRecipes = this.state.recipes.filter(r => r._id !== recipe._id);
          this.setState({
            recipes: [...newRecipes]
          });
        })
        .catch(error => {
          console.error(`Error deleting recipe: ${error}.`);
        });
    }
  };

  logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('baker');
    this.setState({baker: null, token: null});
  };

  render() {
    let {baker, recipes, recipe} = this.state;
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
                      <RecipeList recipes={recipes} clickRecipe={this.viewRecipe} deleteRecipe={this.deleteRecipe} />
                    </React.Fragment>
                    ) : (
                    <React.Fragment>
                      <h2>Welcome!</h2>
                      <p>Please register or login to save/view your recipes.</p>
                    </React.Fragment>
                  )}
              </Route>
              <Route path="/recipes/:recipeId">
                      <Recipe recipe={recipe} />
              </Route>
              <Route 
                exact path="/register" 
                render={() => <Register {...authProps} />} 
              />
              <Route 
                exact path="/login" 
                render={() => <Login {...authProps} />} 
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  };
}

export default App;
