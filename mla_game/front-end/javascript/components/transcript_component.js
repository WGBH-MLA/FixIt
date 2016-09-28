import React from 'react'

var RandTranscriptUI = React.createClass({

  render: function(){
    return (
      <div>
        <h1>{this.props.station} {this.props.transcript}</h1>
        <ul></ul>
      </div>
    )
  }
});
export default RandTranscriptUI;