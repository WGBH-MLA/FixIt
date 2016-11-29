import React from 'react'
import RandTranscriptContainer from '../containers/transcript_random'

class GameOne extends React.Component{
  
  render(){
    return (
      <div>
        <div className="app-content">
          <h1>Game One</h1>
        </div>
        <RandTranscriptContainer />
      </div>
    )
  }

}
export default GameOne;