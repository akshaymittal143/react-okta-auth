import React from 'react';
import {render} from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import Layout from './components/common/Layout';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import ContactPage from './components/contact/ContactPage';
import LoginPage from './components/auth/LoginPage';
import PokerApp from './components/Poker/PokerApp'
import '../scss/site.scss';

render(
  <Router history={browserHistory}>
    <Route path="/" component={Layout}>
      <IndexRoute component={HomePage}/>
      <Route path="/about" component={AboutPage}/>
        <Route path="/poker" component={PokerApp}/>
      <Route path="/contact" component={ContactPage}/>
      <Route path="/login" component={LoginPage}/>
    </Route>
  </Router>,
  document.getElementById('app')
)
