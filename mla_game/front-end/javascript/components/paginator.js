/* eslint-disable react/prop-types */
import React from 'react';

class Paging extends React.Component{
  render(){     
    return(
      <div className="pagination">
        <button onClick={this.props._goBack.bind(this, 3)} className="prev">
          <svg viewBox="0 0 200 200">
            <title>Previous</title>
            <circle cx="100" cy="100" r="90" strokeWidth="15" fill="none" stroke="black" />
            <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
            <polygon points="70,145 145,100 70,55 " transform="matrix(-1,0,0,1,197,0)" />
          </svg>
        </button>
        
        <button onClick={this.props._handleProgress.bind(this, 3)} className='next'>
          <svg viewBox="0 0 200 200">
            <title>Next</title>
            <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
            <polygon points="70, 55 70, 145 145, 100"/>
          </svg>
        </button>
      </div>
    )
  }
}
export default Paging;