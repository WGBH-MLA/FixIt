// imports
import React from 'react'
import ReactDOM from 'react-dom'
// still need to decide if we are going to use react-router
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import GameMenu from './components/gamemenu'
import LeaderBoard from './components/leaderboard'
import Settings from './components/settings'
import Preferences from './components/preferences'



// games
import GameOne from './components/gameone'
import GameTwo from './components/gametwo'
import GameThree from './components/gamethree'

var appTarget = document.getElementById('app');
// Component names should always begin with an uppercase letter
// state = owned by current component
// props = handed down from parent component
/* use an underscore as a prefix for custom functions
   // custom function
   _clickHandler: function(){} 
   // native method to react    
   getInitialState: function(){}
*/

// App Skeleton
var App = React.createClass({
  render: function(){
    return (
      <div>
        <header className='app-header'>
          <h1><Link className='game-title' to='/' onlyActiveOnIndex>Fix It</Link></h1>
          <ul className='app-navigation'>
            <li><Link activeClassName="active" to="leaderboard">
              <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25"></circle>
              </svg></Link>
              LeaderBoard
            </li>
            <li><Link activeClassName="active" to="/" onlyActiveOnIndex>
              <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25"></circle>
              </svg></Link>
              GameMenu
            </li>
            <li><Link activeClassName="active" to="settings">
              <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25"></circle>
              </svg></Link>
              Settings
            </li>
            <li><Link activeClassName="active" to="preferences">
              <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25"></circle>
              </svg></Link>
              Preferences
            </li>
          </ul>
        </header>
        {this.props.children}
      </div>
    )
  }
});

// render the app
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={GameMenu} />      
      <Route path="leaderboard" component={LeaderBoard} />
      <Route path="settings" component={Settings} />
      <Route path="preferences" component={Preferences} />
      <Route path="gameone" component={GameOne} />
      <Route path="gametwo" component={GameTwo} />
      <Route path="gamethree" component={GameThree} />
    </Route>
  </Router>),
appTarget);
