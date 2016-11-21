import React from 'react'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

// test component
var GameMenu = React.createClass({
  render: function(){
    return (
      <div>
        <h1>Game Menu</h1>
        <ul className='game-navigation'>
          <li><Link to="gameone">Game One</Link></li>
          <li><Link to="gametwo">Game Two</Link></li>
          <li><Link to="gamethree">Game Three</Link></li>
        </ul>
      </div>
    )
  }
});

export default GameMenu;