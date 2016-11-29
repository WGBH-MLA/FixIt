import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Audio from '../components/audio_component'
import GameMeta from '../components/game_meta'
import Submit from '../components/submitPhrase_component'
import Phrase from '../components/phrase_list'

class TranscriptUI extends React.Component{

  constructor(){
    super();
    this._selectPhrase = this._selectPhrase.bind(this); 
    this._updateAudio = this._updateAudio.bind(this); 
    this._syncAudio = this._syncAudio.bind(this); 
    this._playPhrase = this._selectPhrase.bind(this);
    
    this.state = {
      currentPhrase:0,
      currentTime:0,
      isPlaying:false,
    }
  }
  
  _selectPhrase(e){
    this.setState({
      currentPhrase:e
    });
  }
  
  _updateAudio() {
    var self = this;
    setTimeout(function() {
     self._syncAudio(); // do it once and then start it up ...
     self._timer = setInterval(self._syncAudio, 250);
    }, 250);
  }

  _syncAudio() {
    var media = document.querySelector('.audio-player');
    this.setState({
      currentTime:media.currentTime,
      isPlaying:!media.paused
    })
  }

  _playPhrase(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }

  componentDidMount(){
    this._updateAudio();
  }

  componentWillUnmount(){
    if(this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
  
  render(){
    return (
    <div>
      <div className="app-content">
        <h3>State Object Debugger</h3>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        
        <div className='game-meta'>
          <Audio src={this.props.media_url} isPlaying={this.state.isPLaying} />
          <GameMeta meta={this.props.meta} aapb_link={this.props.aapb_link} />
        </div>

        <ul className='game-phrase-list'>
          {Object.keys(this.props.phrases).map( key=> <Phrase key={key} isPlaying={this.state.isPlaying} time={this.state.currentTime} index={key} details={this.props.phrases[key]} />)}
          {this.props.phrases.length/8}
        </ul>
      </div>
      <div className="game-footer">
        <div>
          <progress max="100" value="20"></progress>
        </div>
      </div>
    </div>
    )
  }
}

export default TranscriptUI;