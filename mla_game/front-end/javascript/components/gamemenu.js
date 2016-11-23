import React from 'react'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

class GameMenu extends React.Component{
  
  render() {
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

}
export default GameMenu;