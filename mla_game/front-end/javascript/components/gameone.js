import React from 'react'
import RandTranscriptContainer from '../containers/transcript_container'

class GameOne extends React.Component{
  
  render(){
    return (
      <RandTranscriptContainer 
        score={this.props.score} 
        updateScore={this.props.updateScore}
      />
    )
  }

}
export default GameOne;