import React from 'react'

class AudioUI extends  React.Component{

  constructor(){
    super();
    this._playingAudio = this._playingAudio.bind(this); 
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

  _playingAudio(){
    var self = this;
    this.audioPlayer.addEventListener('timeupdate', function(){
      self.props._syncAudio(this.currentTime, !this.paused)
    })
  }

  componentDidMount(){
    this._playingAudio();
  }
  

  _togglePlay() {
    if(this.props.isPlaying) {
      return(
        <g>
          <rect x="78.4" y="78.8" width="16" height="41.9"/>
          <rect x="106.1" y="78.8" width="16" height="41.9"/>
        </g>
      )
    } else {
      return(
        <path className='path' d="M83 71v52.8l42.7-26.4"/>
      )
    } 
  }

  render(){
    const { isPlaying } = this.props;
    return (
      <div className='audio'>
        <button className='play-button' onClick={this._playAudio}>
          <svg className="play-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <defs>
              <filter id="a" filterUnits="userSpaceOnUse" x="-13.8" y="-11.5" width="227.2" height="214.8">
                <feFlood result="back" floodColor="#fff" floodOpacity="1"/>
                <feBlend in="SourceGraphic" in2="back"/>
              </filter>
            </defs>
            <mask maskUnits="userSpaceOnUse" x="-13.8" y="-11.5" width="227.2" height="214.8" id="c">
              <g filter="url(#a)">
                <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="-1341.74" y1="776.722" x2="-1340.508" y2="776.722" gradientTransform="scale(209.2743) rotate(37 -1831.724 1616.687)">
                  <stop offset="0" stopColor="#FFF"/>
                  <stop offset="1"/>
                </linearGradient>
                <path clipPath="url(#SVGID_2_)" fill="url(#b)" d="M71.5-101.4L300.8 71.4 128 300.6l-229.3-172.7z" />
              </g>
            </mask>
            <g clipPath="url(#SVGID_2_)" mask="url(#c)">
              <circle clipPath="url(#SVGID_8_)" fill="none" strokeWidth="30" cx="99.8" cy="99.6" r="84" />
            </g>
            {this._togglePlay()}
          </svg>
        </button>  
        <audio ref={(audio) => {this.audioPlayer = audio}} className="audio-player" src={this.props.src} preload></audio>
      </div>
    )
  }
}

export default AudioUI;