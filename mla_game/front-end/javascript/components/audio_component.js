import React from 'react'

var AudioUI = React.createClass({

  render: function(){
    return (
      <div>
        <button className='play-button'>
          <svg class="video-overlay-play-button" viewBox="0 0 200 200" alt="Play video">
            <circle cx="100" cy="100" r="90" fill="none" stroke-width="15" stroke="#fff"/>
            <polygon points="70, 55 70, 145 145, 100" fill="#fff"/>
          </svg>
        </button>  
        <audio className='audio-player' src={this.props.src}></audio>
      </div>
    )
  }
  
});
export default AudioUI;