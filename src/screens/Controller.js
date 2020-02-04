import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './login/Login';
import Home from './home/Home';

/**
 * Controller Component for handling the URL Paths and routing/loading respective Component
 */
class Controller extends Component {

  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path='/' render={(props) => <Login {...props} />} />
          <Route exact path='/home' render={(props) => <Home {...props} />} />
        </div>
      </Router>
    )
  }
}

export default Controller;
