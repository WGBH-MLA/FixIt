import React from 'react'
import RandTranscriptUI from '../components/transcript_component'

var RandTranscriptContainer = React.createClass({
 
  _getData: function(){
    $.ajax({
      url: '/api/transcript/random/',
    })
    .then(function(data) {
      this.setState({
        series: data.series,
        transcript: data.transcript,
        phrases: data.phrases,
        station: data.station
      });
    }.bind(this));
  },

  getInitialState: function(){
    return {
      series:'',
      transcript:'',
      station:'',
      phrases: []
    }
  },

  componentDidMount: function() {
    this._getData();
  },

  render: function(){
    return (
      <div>
        <RandTranscriptUI phrases={this.state.phrases} station={this.state.station} station={this.state.transcript} />
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
});
export default RandTranscriptContainer;