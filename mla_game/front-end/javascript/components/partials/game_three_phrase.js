import React from 'react'
import classNames from 'classnames'
import Corrections  from './corrections'

class Phrase extends React.Component{
  constructor(){
    super();
    this.markPhrase = this.markPhrase.bind(this)
    this.savePhrase = this.savePhrase.bind(this)
    this.cancel = this.cancel.bind(this)
    this.getEndOfContext = this.getEndOfContext.bind(this)
    this.getStartofContext = this.getStartofContext.bind(this)
    this.setSkipPhrase = this.setSkipPhrase.bind(this)
    this.skipCurrentPhrase = this.skipCurrentPhrase.bind(this)
    this.skipLastPhrase = this.skipLastPhrase.bind(this)
    this.correctedPhrases = this.correctedPhrases.bind(this)

    this.state = {
      editing:false,
      corrected:false
    }
  }

  markPhrase(){
    if(this.state.editing) {
      this.setState({editing:false})
    } else {
      this.setState({editing:true})
    }
  }

  savePhrase(){
    const { details, selectPhrase, disableProgress } = this.props
    
    this.setState({
      editing:false,
      corrected:true,
    })
    const PhraseCorrected = {
        pk:details.pk,
        text:this.span.textContent
    }
    selectPhrase(PhraseCorrected, details.pk)
    disableProgress(false)
  }

  cancel(){
    const { details, removePhrase, disableProgress } = this.props
    this.setState({
      editing:false,
      corrected:false
    })
    removePhrase(details.pk)
    disableProgress(true)
  }
  
  getStartofContext(){
    const { active, details, keys, setStartTime, setSegmentStart, startSegment, skipPhrase } = this.props
    let media = document.querySelector('.audio-player')

    if(active - 1) {
      setStartTime(Number(details.start_time))
      setSegmentStart(Number(details.start_time))
      media.currentTime = startSegment
    }

  }

  getEndOfContext(){
    const { active, details, keys, setSegmentEnd } = this.props
    // set end time for segment
    if(keys === active + 1) {
      setSegmentEnd(Number(details.end_time))
    }
  }

  setSkipPhrase(){
    const {details, keys, active, setSkipPhrase } = this.props;
    if(keys === active + 1) {
      if(details.needs_correction) {
        setSkipPhrase(false)
      } else {
        setSkipPhrase(true)
      }
    }
  }

  skipCurrentPhrase(){
    const {details, keys, active, advanceSegment, advanceTranscript } = this.props
    if(keys == active) {
      if(!details.needs_correction) {
        advanceSegment(1)
      }
    }
  }

  skipLastPhrase(newProps){
    const { active, advanceTranscript, phrasesLength, setSkipPhrase, resetSegments, gameLength, currentTranscript, endOfRoundThree } = newProps
    if(active == phrasesLength + 1) {
      if(currentTranscript < gameLength) {
        setSkipPhrase(false)
        resetSegments(0)
        advanceTranscript(1)
      } else {
        endOfRoundTwo(true)
      }

    }
  }

  correctedPhrases(){
    const {details, active, keys} = this.props
    if(details.corrections) {
      console.log(details.corrections)
      
      details.corrections.map(function(index, elem) {
        <li key={index.pk}>{index.pk} hello</li>
      })   
    }
  }
  
  componentDidMount(){
    this.getEndOfContext()
    this.getStartofContext()
    this.setSkipPhrase()
    this.skipCurrentPhrase()
  }

  componentWillReceiveProps(nextProps){
   this.skipLastPhrase(nextProps)
  }
  
  render(){
    const {details, time, active, keys, editingPhrase} = this.props
    let currentSegment = active === keys

    let phraseState = classNames({
      'text highlighted': true,
      'corrected': this.state.corrected,
      'editing': this.state.editing
    })

    let phrase
    if(currentSegment) {
      phrase = <span className={phraseState} id={details.pk}>
                <span ref={(span) => {this.span = span}} className='context'>{details.text}</span>
                {this.state.editing ?(
                  <div>
                    {details.corrections ? (
                       <ul>
                        {details.corrections.map(function(index, key){
                          return(
                            <li key={key}>
                              <Corrections 
                                text={index.corrected_text}
                              />
                            </li>
                            )
                        })}
                      </ul>
                    ) : (
                      ''
                    )}
                  </div>
                ):(
                  ''
                )}
              </span>
    } else {
      phrase = <span className='text'id={details.pk}>
                <span>{details.text}</span> 
              </span>
    }

    let fixPhraseUi
    if(currentSegment) {
      fixPhraseUi = <div className="phrase-editing">
                      {this.state.editing ? (
                          <div>
                          <button className='correct-phrase' onClick={() => this.savePhrase()}>Save</button>
                          <button className='correct-phrase' onClick={() => this.cancel()}>Cancel</button>
                        </div>
                      ):(
                        <button className="fix-phrase" onClick={() => this.markPhrase()} >Validate</button>
                      )}
                    </div>
    }

    return(
      <div>
        <button className='play-phrase' onClick={() => this.props.playPhrase(details.start_time)} id={`phraseEnd-${details.end_time}`}>
          <title>Play Phrase</title>
          <svg className='speaker-icon' viewBox="0 0 200 200">
            <path d="M73.8 19.9c4.7-4.7 8.6-3.1 8.6 3.6v152c0 6.7-3.9 8.3-8.6 3.6l-44.4-44.3H0V64.2h29.4l44.4-44.3zm27.1 121.6c-2.3 0-4.5-.9-6.2-2.6-3.5-3.4-3.5-9 0-12.5 14.9-14.9 14.9-39.1 0-54-3.5-3.4-3.5-9 0-12.5 3.4-3.4 9-3.4 12.5 0 21.8 21.8 21.8 57.2 0 78.9-1.8 1.9-4 2.7-6.3 2.7m31.4 16.6c-2.3 0-4.5-.9-6.2-2.6-3.4-3.4-3.4-9 0-12.5 24.1-24 24.1-63.2 0-87.2-3.4-3.4-3.4-9 0-12.5 3.5-3.4 9-3.4 12.5 0 15 15 23.3 34.9 23.3 56.1 0 21.2-8.3 41.1-23.3 56.1-1.8 1.8-4.1 2.6-6.3 2.6m31.3 16.7c-2.3 0-4.5-.9-6.2-2.6-3.5-3.4-3.5-9 0-12.5 16.1-16.1 25-37.5 25-60.2 0-22.7-8.9-44.1-25-60.2-3.5-3.4-3.5-9 0-12.5 3.4-3.4 9-3.4 12.5 0C189.3 46.2 200 72 200 99.5s-10.7 53.3-30.2 72.7c-1.7 1.7-3.9 2.6-6.2 2.6"/>
          </svg>
        </button>
        {phrase}
        {fixPhraseUi}
      </div>
    )
  }
}
export default Phrase;