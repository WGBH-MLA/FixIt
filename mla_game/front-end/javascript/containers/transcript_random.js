import React from 'react'

var RandTranscriptContainer = React.createClass({
 
  _getData: function(){
    $.ajax({
      url: '/api/transcript/random/',
    })
    .then(function(data) {
      this.setState({
        series: data.series,
        transcript: data.transcript,
      });

      // for (var i = 0; i < Things.length; i++) {
        // Things[i]
      // }

      
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
        <h1>Imported Component</h1>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
});
export default RandTranscriptContainer;