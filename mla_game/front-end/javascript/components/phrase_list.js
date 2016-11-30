import React from 'react'

class Phrase extends React.Component{

  constructor(){
    super();
    this._activeState = this._activeState.bind(this);
  }
  
  _activeState(start, end, time){
    time <= start || time >= end || time === 0 ? 'not-active-phrase': 'active-phrase';
  }

  render(){
    const {details, time, index} = this.props;
    return (
      <li ref={(li) => {this.li = li}} className={time <= details.start_time || time >= details.end_time ? 'not-active-phrase': 'active-phrase'}>
        <button className='play-phrase' onClick={() => this.props._playPhrase(details.start_time)} id={details.start_time}>
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