// Native React Components
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import store, { history } from './store'
// Nav Views
import Base from './components/app'
import GameMenu from './components/gamemenu'
import LeaderBoard from './components/leaderboard'
import Settings from './components/settings'
import Preferences from './components/preferences'

// games
import GameOne from './components/gameone'
import GameTwo from './components/gametwo'
import GameThree from './components/gamethree'

const appTarget = document.getElementById('app');

// Component names should always begin with an uppercase letter
// state = owned by current component
// props = handed down from parent component
/* use an underscore as a prefix for custom functions
   // custom function
   _clickHandler(){} 
   // native method to react    
   componentDidMount(){}
*/

const App = (
  <Provider store={store}>
    <Router history={history}>
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