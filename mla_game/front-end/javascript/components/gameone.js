import React from 'react'
import RandTranscriptContainer from '../containers/transcript_random'

var GameOne = React.createClass({
  render: function(){
    return (
      <div>
        <h1>Game One</h1>
        <RandTranscriptContainer />
      </div>
    )
  }
});
export default GameOne;