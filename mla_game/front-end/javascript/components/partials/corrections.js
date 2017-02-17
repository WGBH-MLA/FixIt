import React from 'react'

class Corrections extends React.Component {
  render(){
    console.log(this.props)
    return(
      <div>
        {this.props.text}
      </div>
    )
  }
}
export default Corrections;