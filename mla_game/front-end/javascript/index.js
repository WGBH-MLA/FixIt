// Native React Components
import React from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import configureStore from './store'
import { syncHistoryWithStore } from 'react-router-redux'


// Nav Views
import Base from './components/base_connect'
import GameMenu from './components/gamemenu'
import LeaderBoard from './components/leaderboard'
import Settings from './components/settings'
import Preferences from './components/preferences'

// games
import GameOne from './components/gameone'
import GameTwo from './components/gametwo'
import GameThree from './components/gamethree'

const appTarget = document.getElementById('app');
const store = configureStore()

// Component names should always begin with an uppercase letter
/* use an underscore as a prefix for custom functions
   // custom function
   _clickHandler(){} 
   // native method to react    
   componentDidMount(){}
*/

const App = (
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={Base}>
        <IndexRoute component={GameMenu} />      
        <Route path="leaderboard" component={LeaderBoard} />
        <Route path="settings" component={Settings} />
        <Route path="preferences" component={Preferences} />
        <Route path="gameone" component={GameOne} />
        <Route path="gametwo" component={GameTwo} />
        <Route path="gamethree" component={GameThree} />
      </Route>
    </Router>
  </Provider>
);
  

// render the app
 ReactDOM.render((App),appTarget);