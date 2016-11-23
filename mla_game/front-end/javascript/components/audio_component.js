import React from 'react'

class AudioUI extends  React.Component{

  constructor(){
    super();
    this._playAudio = this._playAudio.bind(this); 
  }

  _playAudio(){
    if(this.audioPlayer.paused) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
  }

  render(){
    return (
      <div className='audio'>
        <h1>{this.props.isPlaying }</h1>
        <button className='play-button' onClick={this._playAudio}>
          <svg className="play-icon" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" strokeWidth="15" stroke="#fff"/>
            <polygon points="70, 55 70, 145 145, 100" fill="#fff"/>
          </svg>
        </button>  
        <audio ref={(audio) => {this.audioPlayer = audio}} className="audio-player" src={this.props.src}></audio>
      </div>
    )
  }
}

export default AudioUI;