import React from 'react'
import RandTranscriptUI from '../components/transcript_component'

var RandTranscriptContainer = React.createClass({
 
  _getData: function(){
    $.ajax({
      url: '/api/transcript/random/',
    })
    .then(function(data) {
      data = data[0];
      this.setState({
      media_url: data.media_url,
        phrases: data.phrases,
      });
      console.log(data);
    }.bind(this));
  },

  getInitialState: function(){
    return {
    media_url: '',
      phrases: []
    }
  },

  componentDidMount: function() {
    this._getData();
  },

  render: function(){
    return (
      <div>
        <RandTranscriptUI phrases={this.state.phrases} media_url={this.state.media_url} />
      </div>
    )
  }
});
export default RandTranscriptContainer;