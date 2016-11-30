import React from 'react'

class AudioUI extends  React.Component{

  constructor(){
    super();
    this._playAudio = this._playAudio.bind(this); 
    this._togglePlay = this._togglePlay.bind(this); 
  }

  _playAudio(){
    if(this.audioPlayer.paused) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
  }

  _togglePlay() {
    if(this.props.isPlaying) {
      return(
        <g>
          <rect fill="#fff" width="25.577312" height="88.712906" x="65" y="55.643555" />
          <rect fill="#fff" width="25.577312" height="88.712906" x="110" y="55.643555" />
        </g>
      )
    } else {
      return(
        <polygon points="70, 55 70, 145 145, 100" fill="#fff"/>
      )
    } 
  }

  componentDidMount() {
    this._togglePlay();
  }

  render(){
    const { isPlaying } = this.props;
    return (
      <div className='audio'>
        <button className='play-button' onClick={this._playAudio}>
          {this._togglePlay()}
          <svg className="play-icon" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" fill="none" strokeWidth="15" stroke="#fff"/>
            {this._togglePlay()}
          </svg>
        </button>  
        <audio ref={(audio) => {this.audioPlayer = audio}} className="audio-player" src={this.props.src}></audio>
      </div>
    )
  }
}

export default AudioUI;