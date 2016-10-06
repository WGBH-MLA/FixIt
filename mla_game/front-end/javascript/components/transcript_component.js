import React from 'react'
import Audio from '../components/audio_component'

var RandTranscriptUI = React.createClass({

  _setClass: function(){
    if (this.state.class === 'un-marked'){
      this.setState({
        class: 'incorrect'
      });
    } else {
      this.setState({
        class: 'un-marked'
      });
    }
  },
  
  _playPhrase: function(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
    console.log(media.currentTime);
  }, 
  
  getInitialState:function(){
    return {
      currentPhrase:0,
      class:'un-marked'
    };
  },

  componentDidMount:function(){
  
  },
  
  render: function(){
    return (
    <div>
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
      <Audio src={this.props.media_url} />
       <ul className='phrase-list'>
        {this.props.phrases.map(function (phrase, index){
          return(
          <li key={phrase.pk}>
            <button className='play-button' id={phrase.start_time} onClick={this._playPhrase.bind(this, phrase.start_time)}>Play</button>
            <span className={this.state.class} onClick={this._setClass} id={phrase.pk}>{phrase.text}</span>
          </li>)
        }.bind(this))}
       </ul>
    </div>
    )
  }
});
export default RandTranscriptUI;