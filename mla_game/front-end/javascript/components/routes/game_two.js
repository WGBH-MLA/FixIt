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
    this.goBack = this.goBack.bind(this)
    this.activePhrase = this.activePhrase.bind(this)
    this.playPhrase = this.playPhrase.bind(this)
    this.selectPhrase = this.selectPhrase.bind(this)
    this.reload = this.reload.bind(this)
    
    this.state = {
      correctedPhrases: {}
    }
  }


  selectPhrase(phrase, pk, button) {
    // reference state
    const correctedPhrases = {...this.state.correctedPhrases};
    // keys
    let key = `phrase-${pk}`
    let keyExists = key in correctedPhrases;
    correctedPhrases[key] = phrase;
    
    // push object to state only if it already doesn't exist
    // and set the class name accordingly
    if(keyExists){
      // remove item and set state
      delete correctedPhrases[key];
      this.setState({ correctedPhrases });

    } else {
      this.setState({ correctedPhrases });

    }

  }

  handleProgress() {
    const { wait, advanceTranscript, advanceSegment, gametwo, updateGameProgress, skipPhrase, resetSegments, endOfRoundTwo } = this.props
    let transcriptLength = gametwo.transcripts.length - 1
    let currentTranscriptLength = gametwo.transcripts[gametwo.currentTranscript].phrases_length- 1

    // wait(3000)
    
    if(gametwo.segment <= currentTranscriptLength) {
      if(gametwo.skipPhrase) {
        advanceSegment(2)
        updateGameProgress(2)
      } else {
        advanceSegment(1)
        updateGameProgress(1)
      }
    } else {
      if(gametwo.currentTranscript < transcriptLength) {
        skipPhrase(false)
        resetSegments(0)
        advanceTranscript(1)
      } else {
        endOfRoundTwo(true)
      }
    }
  }

  goBack() {
    const { wait, advanceTranscript, advanceSegment, gametwo, updateGameProgress } = this.props
    let transcriptLength = gametwo.transcripts.length - 1
    let currentTranscriptLength = gametwo.transcripts[gametwo.currentTranscript].phrases.length - 1
    
    if(gametwo.segment > 0) {
      advanceSegment(-1)
      updateGameProgress(-1)
    } else {
      
      if(gametwo.currentTranscript > 0) {
        advanceSegment(0 + transcriptLength)
        advanceTranscript(-1)
      } else {
        return
      }
    }

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
    if(tipDismissed) {
      this.props.showTipTwo(false)
    }
    this.props.resetSegments(0)
    this.props.resetGameScore(0)
    this.props.endOfRoundTwo(false)
    this.props.resetGameProgress(3)
    this.props.fetchGameTwo()
  }


  componentWillMount(){
    this.props.fetchGameTwo()
  }

  
  render(){
    const { gametwo, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegment, skipPhrase, setStartTime } = this.props
    
    if(this.props.gametwo.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return(
        <div>
          <div className='grid'>
            <h1>
               start Segment: {gametwo.startSegment} <br/>
               end Segment: {gametwo.endSegment} <br/>
               current time: {gametwo.currentTime}
            </h1>
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
                               playPhrase={this.playPhrase}
                               time={gametwo.currentTime} 
                               active={gametwo.segment}
                               keys={key}
                               details={phrase}
                               setSegmentStart={setSegmentStart}
                               setSegmentEnd={setSegmentEnd}
                               advanceSegment={advanceSegment}
                               skipPhrase={skipPhrase}
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
              <GameTip dismissTip={this.props.dismissTipTwo} />
            ) : (
              ''
            )}
          </div>
           <GameFooter
            gameNumber={gametwo.gameNumber}
            gameName={gametwo.gameName}
            goBack={this.goBack}
            canGoBack={gametwo.canGoBack}
            handleProgress={this.handleProgress}
            max={gametwo.gameLength - 1}
            value={gametwo.gameProgress}
            waitingUpdate={this.props.waitingUpdate}
            waiting={this.props.gametwo.waiting}
            modalIsOpen={this.props.initialData.modalIsOpen}
            setModal={this.props.setModal}
          />
        </div>
      )
    }
  }
}

export default GameTwo;