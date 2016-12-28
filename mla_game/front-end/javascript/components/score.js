import React from 'react'

class Score extends React.Component {
  render(){
    return(
      <span>{this.props.score}</span>
    )
  }
}
export default Score;