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
        program_title: data.metadata.series,
        broadcast_date: data.metadata.broadcast_date,
        aapb_link:data.aapb_link
      });
      console.log(data);
    }.bind(this));
  },

  getInitialState: function(){
    return {
      media_url: '',
      program_title: '',
      broadcast_date:'',
      aapb_link:'',
      phrases: []
    }
  },

  componentDidMount: function() {
    this._getData();
  },

  render: function(){
    return (
      <RandTranscriptUI phrases={this.state.phrases} media_url={this.state.media_url} broadcast_date={this.state.broadcast_date} program_title={this.state.program_title} aapb_link={this.state.aapb_link} />
    )
  }
});
export default RandTranscriptContainer;