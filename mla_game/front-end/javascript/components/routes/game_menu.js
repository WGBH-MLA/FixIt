import React from 'react'
import { Link } from 'react-router'

class GameMenu extends React.Component{
  
  render() {
    return (
      <div className='grid'>
        <h1>Game Menu</h1>
        <h2 className='welcome-message'>Welcome <span className='username'>{this.props.initialData.user[0].username}</span></h2>
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