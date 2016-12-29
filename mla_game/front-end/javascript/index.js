// Native React Components
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'

// Nav Views
import Header from './components/header'
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

class App extends React.Component{
  render(){
    return(
      <Router history={history}>
        <Route path="/" component={Header}>
          <IndexRoute component={GameMenu} />      
          <Route path="leaderboard" component={LeaderBoard} />
          <Route path="settings" component={Settings} />
          <Route path="preferences" component={Preferences} />
          <Route path="gameone" component={GameOne} />
          <Route path="gametwo" component={GameTwo} />
          <Route path="gamethree" component={GameThree} />
        </Route>
      </Router>
    )
  }
}

// render the app
 ReactDOM.render((
  <App />
),appTarget);