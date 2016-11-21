import React from 'react'
import RandTranscriptContainer from '../containers/transcript_random'

var GameThree = React.createClass({
  render: function(){
    return (
      <div>
        <h1>Game Three</h1>
        <RandTranscriptContainer />
      </div>
    )
  }
});
export default GameThree;