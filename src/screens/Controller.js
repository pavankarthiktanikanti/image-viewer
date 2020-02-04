import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './login/Login';
import Home from './home/Home';

/**
 * Controller Component for handling the URL Paths and routing/loading respective Component
 */
class Controller extends Component {
  /**
   * Set the baseUrl to pass it on to other components in router
   */
  constructor() {
    super();
    this.baseUrl = "https://api.instagram.com/v1/users/self";
  }

  /**
   * Set the base url of instagram api, centralized the url here to pass on 
   * to other components based on the request path
   */
  render() {
    return (
      <Router>
        <div className="main-container">
          <Route exact path='/' render={(props) => <Login {...props} baseUrl={this.baseUrl} />} />
          <Route exact path='/home' render={(props) => <Home {...props} baseUrl={this.baseUrl} />} />
        </div>
      </Router>
    )
  }
}

export default Controller;
