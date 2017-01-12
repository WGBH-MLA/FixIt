// Native React Components
import React from 'react'
import axios from 'axios'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import configureStore from './store'
import { syncHistoryWithStore } from 'react-router-redux'
import NotFound from './components/routes/not_found'


// Nav Views
import Base from './components/base_connect'
import GameMenu from './components/routes/game_menu'
import LeaderBoard from './components/routes/leader_board'
import Settings from './components/routes/settings'
import Preferences from './components/routes/preferences'

// games
import GameOne from './components/routes/game_one'
import GameTwo from './components/routes/game_two'
import GameThree from './components/routes/game_three'

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
        <Route path='*' component={NotFound} />
      </Route>
    </Router>
  </Provider>
);
  

// render the app
 ReactDOM.render((App),appTarget);