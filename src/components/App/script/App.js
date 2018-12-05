import React, { Component } from 'react';
import { Switch } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom';
import IndexView from '../../../views/Index/';
import PostsView from '../../../views/Posts/';
import ContactView from '../../../views/Contact/';
import AboutView from '../../../views/About/';
import NotFoundView from '../../../views/NotFound/';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div data-component="app">

          <Switch>
            <Route
              path="/"
              exact
              component={IndexView}
            />

            <Route
              path="/posts"
              exact
              component={PostsView}
            />

            <Route
              path="/post/:post_id"
              exact
              component={PostsView}
            />

            <Route
              path="/contact"
              exact
              component={ContactView}
            />

            <Route
              path="/about"
              exact
              component={AboutView}
            />

            <Route
              exact
              path="*"
              component={NotFoundView}
            />
          </Switch>

        </div>
      </BrowserRouter>
    );
  }
}

export default App;
