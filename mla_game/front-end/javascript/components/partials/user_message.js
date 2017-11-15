import React from 'react'
import MarkdownRenderer from 'react-markdown-renderer';

class UserMessage extends React.Component {
  constructor(){
    super()
    this.dismiss = this.dismiss.bind(this)
  }
  
  dismiss(){
    this.props.toggleMessage(false)
  }
  
  render(){
    if(this.props.isVisible) {
      return(
        <div className="user-message">
          <button className="dimiss" onClick={() => this.dismiss()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
              <title>Dimiss Notification</title>
              <path d="M403.1 108.9c-81.2-81.2-212.9-81.2-294.2 0s-81.2 212.9 0 294.2c81.2 81.2 212.9 81.2 294.2 0s81.2-213 0-294.2zm-12.3 281.9c-74.3 74.3-195.3 74.3-269.6 0-74.3-74.3-74.3-195.3 0-269.6s195.3-74.3 269.6 0c74.4 74.3 74.4 195.3 0 269.6z"/>
              <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
            </svg>
          </button>
          <svg className='notify-icon' viewBox="0 0 416 416">
            <title>Notification</title>
            <path d="M208,416c23.573,0,42.667-19.093,42.667-42.667h-85.333C165.333,396.907,184.427,416,208,416z"/>
            <path d="M336,288V181.333c0-65.6-34.88-120.32-96-134.827V32c0-17.707-14.293-32-32-32s-32,14.293-32,32v14.507 c-61.12,14.507-96,69.227-96,134.827V288l-42.667,42.667V352h341.333v-21.333L336,288z"/>
          </svg>
          <MarkdownRenderer markdown={this.props.message} />
        </div>
      )
    } else {
      return(
        <div aria-hidden='true'></div>
      )      
    }
  }
}

export default UserMessage