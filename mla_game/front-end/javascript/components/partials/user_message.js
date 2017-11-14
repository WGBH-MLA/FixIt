import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer';

class UserMessage extends React.Component {
  constructor(){
    super()
    this.state = {
      message_visible:true
    }

  }
  render(){
    return(
      <MarkdownRenderer markdown={this.props.message} />
    )
  }
}

export default UserMessage