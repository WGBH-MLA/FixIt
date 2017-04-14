import React from 'react';

class Paging extends React.Component{
  render(){     
    return(
      <div className="pagination">
        <button disabled={this.props.waiting} onClick={this.props.handleProgress.bind(this)} className='next'>
          <span>Next</span>
          <svg viewBox="0 0 200 200">
            <title>Next</title>
            <polygon points="70, 55 70, 145 145, 100"/>
          </svg>
        </button>
      </div>
    )
  }
}
export default Paging;