import React from 'react'
import { Link } from 'react-router'
import GameNav from '../partials/game_navigation'

class GameMenu extends React.Component {
  componentDidMount(){
    console.log(this.props)
  }
  
  render() {
    const { gameScores, gameone, gametwo, gamethree } = this.props
    return (
      <div className='grid'> 
        <Link className='preferences-link' to="preferences">Preferences</Link> 
        <div className="user-info">
            <h2>
              <svg className="nav-icon" viewBox="0 0 200 200">
                <title>User</title>
                <path d="M134.6,115.1c5-4.6,9.4-10.2,12.8-16.5c5.5-10.2,8.4-22,8.4-34.2c0-16.9-5.6-32.8-15.6-44.9 C129.7,6.9,115.6,0,100.4,0S71.1,6.9,60.6,19.5c-10.1,12.1-15.6,28-15.6,44.9c0,12.1,2.9,24,8.4,34.2c3.4,6.4,7.8,12,12.8,16.5 c-11.4,5.5-22,14.9-30.7,27.5c-10.3,15-16.5,32.6-16.5,47.2c0,5.6,4.6,10.2,10.2,10.2h142.4c5.6,0,10.2-4.6,10.2-10.2 c0-14.6-6.2-32.2-16.5-47.2C156.7,130.1,146.1,120.6,134.6,115.1z M40.7,179.7c2-8.3,6-17.5,11.6-25.5 c8.8-12.8,19.7-21.1,30.9-23.5c4.7-1,8-5.1,8-9.9v-7.3c0-3.7-2-7-5.1-8.8c-12.6-7.2-20.7-22.9-20.7-40.2 c0-24.3,15.8-44.1,35.1-44.1s35.1,19.8,35.1,44.1c0,17.2-8.1,33-20.7,40.2c-3.2,1.8-5.1,5.2-5.1,8.8v7.3c0,4.8,3.3,8.9,8,9.9 c11.1,2.4,22.1,10.7,30.9,23.5c5.6,8.1,9.6,17.2,11.6,25.5H40.7z"/>
              </svg>
              <span>{this.props.initialData.username}</span>
            </h2>
            <dl>
              <dt>Total Points:</dt>
              <dd>{gameScores.total_score}</dd>
            </dl>
        </div>
        <GameNav 
          gameScores={gameScores}
          gameone={gameone}
          gametwo={gametwo}
          gamethree={gamethree}
        />
      </div>
    )
  }

}
export default GameMenu;