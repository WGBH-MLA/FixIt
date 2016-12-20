import React from 'react'
import RandTranscriptContainer from '../containers/transcript_random'
import UserContainer from '../containers/user_container'

class GameOne extends React.Component{
  
  render(){
    return (
      <div>
        <UserContainer />
        <RandTranscriptContainer />
      </div>
    )
  }

}
export default GameOne;