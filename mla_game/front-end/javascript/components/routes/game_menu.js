import React from 'react'
import { Link } from 'react-router'

class GameMenu extends React.Component{
  
  render() {
    return (
      <div className='grid'>
        <h1>Game Menu</h1>
        <h2 className='welcome-message'>Welcome <span className='username'>{this.props.initialData.username}</span></h2>
        <ul className='game-navigation'>
          <li><Link to="gameone">Game One</Link></li>
          <li><Link to="gametwo">Game Two</Link></li>
          <li><Link to="gamethree">Game Three</Link></li>
        </ul>
        <ul>
          <li>game one score {this.props.gameScores.game_one_score}</li>
          <li>game two score {this.props.gameScores.game_two_score}</li>
          <li>game three score {this.props.gameScores.game_three_score}</li>
        </ul>
      </div>
    )
  }

}
export default GameMenu;