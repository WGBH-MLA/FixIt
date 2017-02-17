import React from 'react'
import { Link } from 'react-router'
import LoadingScreen from '../partials/loading_screen'
import GameMeta from '../partials/game_meta'
import Audio from '../partials/audio'
import Phrase from '../partials/game_two_phrase'
import Paging from '../partials/paginator'
import { postData } from '../../helpers'
import GameFooter from '../partials/game_footer'
import GameTip from '../partials/game_tip'

class GameTwo extends React.Component{

  constructor(){
    super()

    this.handleProgress = this.handleProgress.bind(this)
    this.activePhrase = this.activePhrase.bind(this)
    this.playPhrase = this.playPhrase.bind(this)
    this.selectPhrase = this.selectPhrase.bind(this)
    this.removePhrase = this.removePhrase.bind(this)
    this.reload = this.reload.bind(this)
    
    this.state = {
      phrase:null,
    }

  }

  selectPhrase(phrase) {
    this.setState({phrase:phrase})
  }
  
  removePhrase() {
    this.setState({
      phrase:null,
    })
  }

  handleProgress() {
    const { details, wait, advanceTranscript, advanceSegment, gametwo, updateTotalScore, updateGameScore, updateGameProgress } = this.props
    let currentTranscriptLength = gametwo.transcripts[gametwo.currentTranscript].phrases_length - 1
    let noCorrectionExists = this.state.phrase == null

    if(gametwo.segment <= currentTranscriptLength) {
      if(gametwo.skipPhrase) {
        advanceSegment(2)
        updateGameProgress(2)
      } else {
        advanceSegment(1)
        updateGameProgress(1)

      }
    } 
    
    // create on object for correction and push it if it exists 
    if(!noCorrectionExists) {
      //phrase data from local state
      let phraseData = {
        transcript_phrase:this.state.phrase.pk,
        correction:this.state.phrase.text
      }
      // score data
      let phraseScore = {
        game:'2',
        score:11
      }
      // post score and phrase
      postData('/api/transcriptphrasecorrection/', phraseData)
      postData('/api/score/', phraseScore)
      // update scores
      updateTotalScore(11)
      updateGameScore(11)
      this.props.disableProgress(true)
    } 

    // scrub state for phrase correction
    this.removePhrase()
  }

  activePhrase(time, start, end){
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
  
  playPhrase(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }

  reload(){
    let tipDismissed = this.props.gametwo.inGameTip
    this.props.resetSegments(0)
    this.props.resetGameScore(0)
    this.props.resetTranscript(0)
    this.props.resetGameProgress(3)
    this.props.endOfRoundTwo(false)
    this.props.fetchGameTwo()
    
    if(tipDismissed) {
      this.props.showTipTwo(true)
    }
  }
  
  componentWillMount(){
    this.props.fetchGameTwo()
  }

  componentWillUnmount(){
    // update gameone score in state
    this.props.updateGameTwoScore(this.props.gametwo.gameScore)
    // reset gamestate
    this.reload()
  }
  

  render(){
    const { gametwo, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegment, advanceTranscript, skipPhrase, setStartTime, disableProgress, resetSegments, endOfRoundTwo } = this.props
    
    if(this.props.gametwo.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return(
        <div>
          <div className='grid'>
            {gametwo.endOfRound ? (
              <div className='roundup'>
                <h1>End Of Round</h1>
                <h2><span className='username'>{this.props.initialData.user[0].username}</span> Just Scored: {gametwo.gameScore} Points</h2>
                <ul className='game-navigation'>
                  <li><Link to="gameone">Game One</Link></li>
                  <li><Link onClick={() => this.reload()} to="gametwo">Game Two</Link></li>
                  <li><Link to="gamethree">Game Three</Link></li>
                </ul>
              </div>
            ) : (
              <div>
                {gametwo.transcripts.map((index, key) => {
                // get current trancript
                let transcript = Number(key)
                if(transcript == gametwo.currentTranscript) {
                  return(
                    <div key={key}>
                      <div className="game-meta">
                        <Audio 
                          isPlaying={gametwo.isPlaying}
                          src={index.media_url} 
                          setCurrentTime={setCurrentTime}
                          setIsPlaying={setIsPlaying}
                          startTime={gametwo.startTime} 
                          endSegment={gametwo.endSegment}
                          startSegment={gametwo.startSegment}
                        />
                        <GameMeta 
                          meta={index.metadata} 
                          aapb_link={index.aapb_link} 
                        />
                      </div>
                      <ul className="game-phrase-list">
                      {index.phrases.map((phrase, key) => {
                        let phrases = Number(key)
                        let currentPhrase = gametwo.segment <= phrases + 1 && gametwo.segment >= phrases -1
                        if(currentPhrase){
                          return(
                            <li key={key} className={this.activePhrase(gametwo.currentTime, phrase.start_time, phrase.end_time)}>
                              <Phrase
                               selectPhrase={this.selectPhrase}
                               removePhrase={this.removePhrase}
                               playPhrase={this.playPhrase}
                               disableProgress={disableProgress}
                               time={gametwo.currentTime} 
                               active={gametwo.segment}
                               keys={key}
                               details={phrase}
                               setSegmentStart={setSegmentStart}
                               startSegment={gametwo.startSegment}
                               setSegmentEnd={setSegmentEnd}
                               advanceSegment={advanceSegment}
                               endOfRoundTwo={endOfRoundTwo}
                               currentTranscript={gametwo.currentTranscript}
                               gameLength={gametwo.transcripts.length - 1}
                               phrasesLength={gametwo.transcripts[gametwo.currentTranscript].phrases_length - 1}
                               advanceTranscript={advanceTranscript}
                               resetSegments={resetSegments}
                               setSkipPhrase={skipPhrase}
                               skipPhrase={gametwo.skipPhrase}
                               setStartTime={setStartTime}
                              />
                            </li>
                          )
                        }
                      })}
                      </ul>
                    </div>
                  )
                }
              })}
              </div>
            )}
            
            {gametwo.inGameTip ? (
              <GameTip 
                dismissTip={this.props.showTipTwo}
                text={'Intructions for game two go here'} 
              />
            ) : (
              ''
            )}
          </div>
           <GameFooter
            gameNumber={gametwo.gameNumber}
            gameName={gametwo.gameName}
            canGoBack={gametwo.canGoBack}
            handleProgress={this.handleProgress}
            max={gametwo.gameLength - 1}
            value={gametwo.gameProgress}
            waitingUpdate={this.props.waitingUpdate}
            waiting={gametwo.disableProgress}
            modalIsOpen={this.props.initialData.modalIsOpen}
            setModal={this.props.setModal}
          />
        </div>
      )
    }
  }
}

export default GameTwo;