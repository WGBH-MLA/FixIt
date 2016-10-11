import React from 'react'

var SubmitPhrase = React.createClass({

  render: function(){
    return (
      <button type='submit' className='submit-phrase' id={this.props.id}>Submit Phrase</button>
    )
  }
  
});
export default SubmitPhrase;