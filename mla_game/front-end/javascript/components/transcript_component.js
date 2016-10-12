import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Audio from '../components/audio_component'
import Submit from '../components/submitPhrase_component'

var RandTranscriptUI = React.createClass({

  _selectPhrase: function(e){
    this.setState({
      currentPhrase:e
    });
  },

  _updateTime: function(){
    var media = document.querySelector('.audio-player');
    // only update currenTime if media is playing
    if(!media.paused){
      this.setState({
        currentTime:media.currentTime
      })
    }
  },

  _playPhrase: function(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
    this.setState({
      currentTime:media.currentTime
    })
  }, 
  
  getInitialState:function(){
    return {
      currentPhrase:0,
      currentTime:0
    };
  },

  componentDidMount:function(){
    var currentTime = setInterval(this._updateTime, 1000);
    this.setState({
      currentTime:currentTime
    });
  },
  
  render: function(){
    return (
    <div>
      <h3>State Object Debugger</h3>
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
      <div className='game'>
        <Audio src={this.props.media_url} />
      </div>
       <ul className='phrase-list'>
        {this.props.phrases.map(function(phrase){
          return(
          <li key={phrase.pk}>
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