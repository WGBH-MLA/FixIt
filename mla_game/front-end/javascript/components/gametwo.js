import React from 'react'
import RandTranscriptContainer from '../containers/transcript_container'

class GameTwo extends React.Component{
  
  render(){
    return (
      <div>
        <div className='grid'>
          <h1>Game Two</h1>
        </div>
        <RandTranscriptContainer />
      </div>
    )
  }

}
export default GameTwo;