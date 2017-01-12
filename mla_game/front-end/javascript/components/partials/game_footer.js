import React from 'react'
import Paging from './paginator'

class GameFooter extends React.Component{
  render(){
    return(
      <div className="game-footer">
        <div className="grid">
          <h2 className='title delta'><span>1</span> Identify Errors</h2>
          <div className="controls">
            <Paging 
              goBack={this.props.goBack} 
              handleProgress={this.props.handleProgress} 
            />                
            <progress className="game-progress" max={this.props.max} value={this.props.value}></progress>
          </div>
          <button className="help">
            <title>Help</title>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
            <path d="M90.2 120.6c-.4-4.6-.2-8.6.7-11.8.9-3.2 2.1-6 3.7-8.4 1.6-2.4 3.3-4.4 5.3-6.1 2-1.7 3.9-3.4 5.6-5 1.7-1.6 3.2-3.3 4.3-5 1.2-1.7 1.7-3.8 1.7-6.2 0-3.1-.9-5.6-2.6-7.5-1.7-1.9-4.8-2.8-9.3-2.8-1.4 0-2.9.2-4.5.5s-3.2.8-4.8 1.3c-1.6.6-3.1 1.2-4.6 2-1.5.8-2.8 1.5-3.9 2.3l-6.7-12.8c3.4-2.3 7.3-4.2 11.7-5.7 4.4-1.5 9.7-2.3 15.9-2.3 8.4 0 14.9 2 19.6 6.1 4.7 4 7.1 9.5 7.1 16.3 0 4.5-.6 8.3-1.8 11.3-1.2 3-2.7 5.5-4.5 7.6-1.8 2.1-3.7 3.9-5.9 5.5-2.1 1.6-4.1 3.3-5.9 5.1-1.8 1.8-3.3 3.9-4.5 6.3-1.2 2.4-1.9 5.5-1.9 9.2H90.2zm-2.7 19c0-3.1 1-5.6 2.9-7.4 2-1.8 4.5-2.7 7.7-2.7 3.4 0 6 .9 8 2.7 2 1.8 2.9 4.3 2.9 7.4 0 3.1-1 5.6-2.9 7.5-2 1.9-4.6 2.8-8 2.8-3.2 0-5.8-.9-7.7-2.8s-2.9-4.4-2.9-7.5z"/>
            </svg>
          </button>              
        </div>
      </div>
    )
  }
}
export default GameFooter;