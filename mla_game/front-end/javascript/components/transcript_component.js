import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Audio from '../components/audio_component'
import GameMeta from '../components/game_meta'
import Submit from '../components/submitPhrase_component'

var RandTranscriptUI = React.createClass({
  
  _selectPhrase: function(e){
    this.setState({
      currentPhrase:e
    });
  },
  
  _updateAudio: function() {
      var self = this;
      setTimeout(function() {
       self._syncAudio(); // do it once and then start it up ...
       self._timer = setInterval(self._syncAudio, 1000);
      }, 1000);
  },

  _syncAudio: function() {
    var media = document.querySelector('.audio-player');
    this.setState({
      currentTime:media.currentTime
    })
  },

  _playPhrase: function(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }, 
  
  getInitialState:function(){
    return {
      currentPhrase:0,
      currentTime:0
    };
  },

  componentDidMount:function(){
    this._updateAudio();
  },

  componentWillUnmount:function(){
    if(this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },
  
  render: function(){
    return (
    <div>
        {/*
          <h3>State Object Debugger</h3>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        */}
      
      <div className='game-meta'>
        <Audio src={this.props.media_url} />
        <GameMeta program_title={this.props.program_title} broadcast_date={this.props.broadcast_date} aapb_link={this.props.aapb_link} />
      </div>
      
       <ul className='phrase-list'>
        {this.props.phrases.map(function(phrase){
          return(
          <li key={phrase.pk} className={this.state.currentTime <= phrase.start_time || this.state.currentTime >= phrase.end_time ? 'not-active-phrase': 'active-phrase'}>
            <button className='play-button' id={phrase.start_time} onClick={this._playPhrase.bind(this, phrase.start_time)}>Play</button>
            <button className={this.state.currentPhrase === phrase.pk ? 'incorrect phrase' : 'un-marked phrase'} onClick={this._selectPhrase.bind(this, phrase.pk)} id={phrase.start_time}>{phrase.text}</button>
            <ReactCSSTransitionGroup transitionName="submit-phrase" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
              {this.state.currentPhrase === phrase.pk ? <Submit /> : null }
            </ReactCSSTransitionGroup>  
          </li>)
        }.bind(this))}
       </ul>
    </div>
    )
  }
});
export default RandTranscriptUI;