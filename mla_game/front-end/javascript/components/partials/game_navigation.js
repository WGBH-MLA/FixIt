import React from 'react'
import { Link } from 'react-router'

class GameNav extends React.Component {
  
  render() {
    const { gameScores, gameone, gametwo, gamethree } = this.props
    return (
      <ul className='game-navigation'>
        <li>
          <h2><span className='game-number'>{gameone.gameNumber}</span> <span className='game-name'>{gameone.gameName}</span></h2>
          <span className='game-score'>{gameScores.game_one_score}</span>
          <span className='points'>Points</span>
          <Link className='play-link' to="gameone">Play</Link>
        </li>
        <li>
          <h2><span className='game-number'>{gametwo.gameNumber}</span> <span className='game-name'>{gametwo.gameName}</span></h2>
          <span className='game-score'>{gameScores.game_two_score}</span>
          <span className='points'>Points</span>
          <Link className='play-link' to="gametwo">Play</Link>
        </li>
        <li>
          <h2><span className='game-number'>{gamethree.gameNumber}</span> <span className='game-name'>{gamethree.gameName}</span></h2>
          <span className='game-score'>{gameScores.game_three_score}</span>
          <span className='points'>Points</span>
          <Link className='play-link' to="gamethree">Play</Link>
        </li>
      </ul>
    )
  }

}
export default GameNav;