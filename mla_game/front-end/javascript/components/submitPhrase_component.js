import React from 'react'

class SubmitPhrase extends React.Component{

  render(){
    return (
      <button type='submit' className='submit-phrase' id={this.props.id}>Submit Phrase</button>
    )
  }
  
}
export default SubmitPhrase;