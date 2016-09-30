import React from 'react'

var RandTranscriptUI = React.createClass({
  
  _playPhrase: function(callback){
    var media = document.querySelector('.react-audio-player');
    media.currentTime = callback;
    media.play();
  }, 
  
  getInitialState:function(){
    return {
      currentPhrase:0,
    };
  },

  componentDidMount:function(){
    return {
      currentPhrase:0,
    };
  },
  
  render: function(){
    return (
    <div>
      <audio className='react-audio-player' src={this.props.media_url} controls></audio>
      <pre>{JSON.stringify(this.state, null, 2)}</pre>
       <ul className='phrase-list'>
        {this.props.phrases.map(function (phrase, index){
          return (
          <li key={phrase.pk}>
            <button className='play-button' onClick={this._playPhrase.bind(this, phrase.start_time)} id={phrase.start_time}>Play</button>
            <span className='phrase' id={phrase.pk}>{phrase.text}</span>
          </li>)
        }.bind(this))}
       </ul>
    </div>
    )
  }
});
export default RandTranscriptUI;