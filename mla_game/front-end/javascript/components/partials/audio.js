import React from 'react'

class Audio extends  React.Component{

  constructor(){
    super();
    this.playingAudio = this.playingAudio.bind(this); 
    this.playPause = this.playPause.bind(this); 
    this.togglePlay = this.togglePlay.bind(this); 
  }

  playPause(){
    const { audioPlayer } = this
    if(audioPlayer.paused) {
      audioPlayer.play()
    } else {
      audioPlayer.pause()
    }
  }

  playingAudio(){
    const { setCurrentTime, setIsPlaying, isPlaying } = this.props    
    const self = this
    this.audioPlayer.addEventListener('timeupdate', function(){
      setCurrentTime(this.currentTime)
      if(self.props.endSegment <= this.currentTime) {
        this.pause()
      }
    })
    this.audioPlayer.addEventListener('play', function(){
      setIsPlaying(true)
    })
    this.audioPlayer.addEventListener('pause', function(){
      setIsPlaying(false)
    })
    this.audioPlayer.addEventListener('loadstart', function(){
      this.currentTime = self.props.startTime
    })
  }  
  
  togglePlay() {
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

  componentDidMount(){
    this.playingAudio()
  }
  
  render(){
    const { isPlaying } = this.props;
    return (
      <div className='audio'>
        <button className='play-button' onClick={() => this.playPause()}>
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
            {this.togglePlay()}
          </svg>
        </button>  
        <audio ref={(audio) => {this.audioPlayer = audio}} className="audio-player" src={this.props.src} preload></audio>
      </div>
    )
  }
}

export default Audio;