import React from 'react'

class Phrase extends React.Component{

  constructor(){
    super();
    this._activePhrase = this._activePhrase.bind(this);
    this._getContext = this._getContext.bind(this);
  }
  
  _activePhrase(time, start, end){
    const playingPhrase = time <= start || time >= end; 
    if(playingPhrase) {
      return(
        'not-active-phrase'
      )
    } else {
      return(
        'active-phrase'
      )
    }
  }
  
  render(){
    const {details, time, index} = this.props;
    return (
      <li ref={(li) => {this.li = li}} className={this._activePhrase(time, details.start_time, details.end_time)}>
        <button className='play-phrase' onClick={() => this.props._playPhrase(details.start_time)} id={details.start_time}>
          <title>Play Phrase</title>
          <svg className='speaker-icon' viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
            <circle cx="25" cy="25" r="25"></circle>
          </svg>
        </button>
        <button className='text' onClick={() => this.props._selectPhrase(details.pk)} id={details.pk}>{details.text}</button>
      </li>
    )
  }
}
export default Phrase;