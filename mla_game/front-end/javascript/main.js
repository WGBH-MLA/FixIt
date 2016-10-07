// imports
import React from 'react'
import ReactDOM from 'react-dom'
// still need to decide if we are going to use react-router
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'
// random transcript container
import RandTranscriptContainer from './containers/transcript_random'

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

// test component
var App = React.createClass({
  render: function(){
    return (
      <div>
        <header>
          <h1><Link to='/'>MLA Game</Link></h1>
        </header>
        <ul className='app-navigation'>
          <li><Link to='/'>Home</Link></li>
          <li><Link activeClassName="active" to="about">About</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
});

// test component
var Home = React.createClass({
  render: function(){
    return (
      <RandTranscriptContainer />
    )
  }
});

// test component
var About = React.createClass({
  render: function(){
    return (
      <h2>I am a component only loaded on the about page</h2>
    )
  }
});

// render the app
ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home} />      
      <Route path="about" component={About} />
    </Route>
  </Router>),
appTarget);
