// Native React Components
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

// Nav Views
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

// App Skeleton
class App extends React.Component {
  render() {
    return(
      <div>
        <header className='app-header'>
          <div>
            <h1 className='game-title'><Link to='/' onlyActiveOnIndex>Fix It</Link></h1>
            <span className='score delta'>1580</span>
            <ul className='app-navigation'>
              <li><Link activeClassName="active" to="leaderboard">
                <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="25"></circle>
                </svg></Link>
                <span>LeaderBoard</span>
              </li>
              <li><Link activeClassName="active" to="/" onlyActiveOnIndex>
                <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="25"></circle>
                </svg></Link>
                <span>GameMenu</span>
              </li>
              <li><Link activeClassName="active" to="settings">
                <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="25"></circle>
                </svg></Link>
                <span>Settings</span>
              </li>
              <li><Link activeClassName="active" to="preferences">
                <svg className="nav-icon" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="25" cy="25" r="25"></circle>
                </svg></Link>
                <span>Preferences</span>
              </li>
            </ul>
          </div>
        </header>
        <div>
          {this.props.children}
        </div>
      </div>
    )
  }
};

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
