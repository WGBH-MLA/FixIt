import React from 'react'

class Phrase extends React.Component{
  render(){
    const {details} = this.props;
    return (
      <li>
        <button>Play Phrase</button>
        <button>{details.text}</button>
      </li>
    )
  }
}
export default Phrase;