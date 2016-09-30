import React from 'react'

var AudioUI = React.createClass({

  render: function(){
    return (
      <audio className='audio-player' src={this.props.src} controls></audio>
    )
  }
  
});
export default AudioUI;