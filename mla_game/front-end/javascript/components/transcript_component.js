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
    this._syncAudio = this._syncAudio.bind(this); 
    this._playPhrase = this._playPhrase.bind(this);
    
    this.state = {
      currentPhrase:[],
      currentTime:0,
      isPlaying:false
    }
  }
  
  _selectPhrase(e){
    this.setState({
      currentPhrase:[e]
    });
  }

  _syncAudio(time, paused) {
    this.setState({
      currentTime:time,
      isPlaying:paused
    })
  }

  _playPhrase(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }
    
  render(){
    return (
    <div>
      <div className="app-content">
        <h3>State Object Debugger</h3>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
        
        <div className='game-meta'>
          <Audio src={this.props.media_url} _syncAudio={this._syncAudio}  isPlaying={this.state.isPlaying} />
          <GameMeta meta={this.props.meta} aapb_link={this.props.aapb_link} />
        </div>

        <ul className='game-phrase-list'>
          {Object.keys(this.props.phrases).map( key=> <Phrase key={key} _playPhrase={this._playPhrase} _selectPhrase={this._selectPhrase} time={this.state.currentTime} index={key} details={this.props.phrases[key]} />)}
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