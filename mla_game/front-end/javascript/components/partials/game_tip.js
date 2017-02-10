import React from 'react'

class GameTip extends React.Component{
  
  constructor(){
    super()

    this.dismiss = this.dismiss.bind(this)
  }

  dismiss(){
    this.props.dismissTip(false)
  }
  
  render(){
    return(
      <div className="game-tip">
        <button className='dismiss-tip' onClick={() => this.dismiss()} >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
            <title>Dismiss</title>
            <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
          </svg>
        </button>
        <p>{this.props.text}</p>
      </div> 
    )
  }
}

GameTip.proptypes = {
  text:React.PropTypes.string.isRequired,
  dismissTip:React.PropTypes.func.isRequired
}

export default GameTip