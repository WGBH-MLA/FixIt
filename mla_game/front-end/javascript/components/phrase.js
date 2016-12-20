import React from 'react'

class Phrase extends React.Component{

  constructor(){
    super();
    this._activePhrase = this._activePhrase.bind(this);
    this._context = this._context.bind(this);
    this._markPhrases = this._markPhrases.bind(this);
    this._markedIndication = this._markedIndication.bind(this);
  }

  _markPhrases(){
    // shortcut for props
    const {details, wrongPhrases} = this.props;
    
    // create object that gets pushed to state
    const PhraseMarked = {
        pk:details.pk,
        text:details.text
    }
    this.props._selectPhrase(PhraseMarked, details.pk);

    let key = `phrase-${this.button.id}`
    let hasKey = key in wrongPhrases;

    if(hasKey) {
      this.button.className = 'text'
    } else {
      this.button.className = 'text highlighted'
    }
  }

  _context(){
    let keys = Number(this.props.keys);
    let context = this.props.active === keys || this.props.active === keys - 1 || this.props.active === keys + 1;
    if(context) {
      return(
        'context'
      )
    } else {
      return(
        ''
      )
    }
  }

  _markedIndication(){
    console.log(this.props.wrongPhrases);
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
    const {details, time, active} = this.props;
    return (
      <li ref={(li) => {this.li = li}} className={this._activePhrase(time, details.start_time, details.end_time)}>
        <button className='play-phrase' onClick={() => this.props._playPhrase(details.start_time)} id={details.start_time}>
          <title>Play Phrase</title>
          <svg className='speaker-icon' viewBox="0 0 200 200">
            <path d="M73.8 19.9c4.7-4.7 8.6-3.1 8.6 3.6v152c0 6.7-3.9 8.3-8.6 3.6l-44.4-44.3H0V64.2h29.4l44.4-44.3zm27.1 121.6c-2.3 0-4.5-.9-6.2-2.6-3.5-3.4-3.5-9 0-12.5 14.9-14.9 14.9-39.1 0-54-3.5-3.4-3.5-9 0-12.5 3.4-3.4 9-3.4 12.5 0 21.8 21.8 21.8 57.2 0 78.9-1.8 1.9-4 2.7-6.3 2.7m31.4 16.6c-2.3 0-4.5-.9-6.2-2.6-3.4-3.4-3.4-9 0-12.5 24.1-24 24.1-63.2 0-87.2-3.4-3.4-3.4-9 0-12.5 3.5-3.4 9-3.4 12.5 0 15 15 23.3 34.9 23.3 56.1 0 21.2-8.3 41.1-23.3 56.1-1.8 1.8-4.1 2.6-6.3 2.6m31.3 16.7c-2.3 0-4.5-.9-6.2-2.6-3.5-3.4-3.5-9 0-12.5 16.1-16.1 25-37.5 25-60.2 0-22.7-8.9-44.1-25-60.2-3.5-3.4-3.5-9 0-12.5 3.4-3.4 9-3.4 12.5 0C189.3 46.2 200 72 200 99.5s-10.7 53.3-30.2 72.7c-1.7 1.7-3.9 2.6-6.2 2.6"/>
          </svg>
        </button>
        <button ref={(button) => {this.button = button}} className='text' onClick={() => this._markPhrases()} id={details.pk}>
          <span className={this._context()}>{details.text}</span> 
        </button>
      </li>
    )
  }
}
export default Phrase;