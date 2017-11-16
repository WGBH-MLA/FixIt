import React from 'react'
import classNames from 'classnames'

class Corrections extends React.Component {
  
  render(){
    return(
      <div className="vote-option corrected">
        {this.props.text}
      </div>
    )
  }
}
export default Corrections;