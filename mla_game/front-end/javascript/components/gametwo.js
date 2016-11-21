import React from 'react'
import RandTranscriptContainer from '../containers/transcript_random'

var GameTwo = React.createClass({
  render: function(){
    return (
      <div>
        <h1>Game Two</h1>
        <RandTranscriptContainer />
      </div>
    )
  }
});
export default GameTwo;