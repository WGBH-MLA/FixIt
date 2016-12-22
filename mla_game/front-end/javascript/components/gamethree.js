import React from 'react'
import RandTranscriptContainer from '../containers/transcript_random'

class GameThree extends React.Component{
  
  render(){
    return (
      <div>
        <div className='grid'>
          <h1>Game Three</h1>
        </div>
        <RandTranscriptContainer />
      </div>
    )
  }

}
export default GameThree;