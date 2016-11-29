import React from 'react'
import scrollToElement from 'scroll-to-element'

class Phrase extends React.Component{

  constructor(){
    super();
    this._activeState = this._activeState.bind(this);
    this._scroller = this._scroller.bind(this);
  }

  _scroller(){
   const active = this.li.className === 'active-phrase';
  }

  _activeState(start, end, time){
    time <= start || time >= end || time === 0 ? 'not-active-phrase': 'active-phrase';
  }

  componentDidUpdate() {
    this._scroller();
  }

  render(){
    const {details, time, isPlaying} = this.props;
    return (
      <li ref={(li) => {this.li = li}} className={time <= details.start_time || time >= details.end_time ? 'not-active-phrase': 'active-phrase'}>
        <button className='play-phrase' id={details.start_time}>
          <title>Play Phrase</title>
          <svg className='speaker-icon' viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25"></circle>
          </svg>
        </button>
        <button className='text' id={details.pk}>{details.text}</button>
      </li>
    )
  }
}
export default Phrase;