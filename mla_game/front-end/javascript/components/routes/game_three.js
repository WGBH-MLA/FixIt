import React from 'react'
import { Link } from 'react-router'
import LoadingScreen from '../partials/loading_screen'
import GameMeta from '../partials/game_meta'
import Audio from '../partials/audio'
import Phrase from '../partials/game_three_phrase'
import Paging from '../partials/paginator'
import { postData } from '../../helpers'
import GameFooter from '../partials/game_footer'
import GameTip from '../partials/game_tip'


class GameThree extends React.Component{
  constructor(){
    super()

    this.handleProgress = this.handleProgress.bind(this)
    this.activePhrase = this.activePhrase.bind(this)
    this.playPhrase = this.playPhrase.bind(this)
    this.selectPhrase = this.selectPhrase.bind(this)
    this.setActive = this.setActive.bind(this)
    this.removePhrase = this.removePhrase.bind(this)
    this.reload = this.reload.bind(this)

    this.state = {
      phrase:null,
      active:null,
    }

  }

  selectPhrase(phrase) {
    this.setState({phrase:phrase})
  }

  setActive(pk){
    this.setState({active:pk})
  }
  
  removePhrase() {
    this.setState({
      phrase:null,
    })
  }
  
  handleProgress() {
    const { details, wait, advanceTranscript, advanceSegment, gamethree, updateTotalScore, updateGameScore, updateGameProgress } = this.props
    let currentTranscriptLength = gamethree.transcripts[gamethree.currentTranscript].phrases_length - 1
    let noCorrectionExists = this.state.phrase == null

    if(gamethree.segment <= currentTranscriptLength) {
      if(gamethree.skipPhrase) {
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
        transcript_phrase:this.state.phrase.pk
      }
      // score data
      let phraseScore = {
        game:'3',
        score:11
      }
      // post score and phrase
      postData('/api/transcriptphrasecorrection/', phraseData).then(function(data){
        console.log(data)
      })
      postData('/api/score/', phraseScore)
      // update scores
      updateTotalScore(11)
      updateGameScore(11)
      this.props.disableProgress(true)
      this.setActive(null)
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
    let tipDismissed = this.props.gamethree.inGameTip
    this.props.resetSegments(0)
    this.props.resetGameScore(0)
    this.props.resetTranscript(0)
    this.props.resetGameProgress(3)
    this.props.endOfRoundThree(false)
    this.props.fetchGameThree()
    
    if(tipDismissed) {
      this.props.showTipThree(true)
    }
  }

  componentWillMount(){
    this.props.fetchGameThree()
  }

  
  render(){
    const { gamethree, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegment, advanceTranscript, skipPhrase, setStartTime, disableProgress, resetSegments, endOfRoundThree} = this.props
    
    if(this.props.gamethree.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return (
        <div>
          <div className='grid'>
            {gamethree.endOfRound ? (
              <div className='roundup'>
                <h1>End Of Round</h1>
                <h2><span className='username'>{this.props.initialData.user[0].username}</span> Just Scored: {gamethree.gameScore} Points</h2>
                <ul className='game-navigation'>
                  <li><Link to="gameone">Game One</Link></li>
                  <li><Link to="gametwo">Game Two</Link></li>
                  <li><Link onClick={() => this.reload()} to="gamethree">Game Three</Link></li>
                </ul>
              </div>
            ) : (
              <div>
                {gamethree.transcripts.map((index, key) => {
                // get current trancript
                let transcript = Number(key)
                if(transcript == gamethree.currentTranscript) {
                  return(
                    <div key={key}>
                      <pre>{JSON.stringify(this.state, null, 2)}</pre>
                      <div className="game-meta">
                        <Audio 
                          isPlaying={gamethree.isPlaying}
                          src={index.media_url} 
                          setCurrentTime={setCurrentTime}
                          setIsPlaying={setIsPlaying}
                          startTime={gamethree.startTime} 
                          endSegment={gamethree.endSegment}
                          startSegment={gamethree.startSegment}
                        />
                        <GameMeta 
                          meta={index.metadata} 
                          aapb_link={index.aapb_link} 
                        />
                      </div>
                      <ul className="game-phrase-list">
                      {index.phrases.map((phrase, key) => {
                        let phrases = Number(key)
                        let currentPhrase = gamethree.segment <= phrases + 1 && gamethree.segment >= phrases -1
                        if(currentPhrase){
                          return(
                            <li key={key} className={this.activePhrase(gamethree.currentTime, phrase.start_time, phrase.end_time)}>
                              <Phrase
                               activeVote={this.state.active}
                               selectPhrase={this.selectPhrase}
                               setActive={this.setActive}
                               removePhrase={this.removePhrase}
                               playPhrase={this.playPhrase}
                               disableProgress={disableProgress}
                               time={gamethree.currentTime} 
                               active={gamethree.segment}
                               keys={key}
                               details={phrase}
                               setSegmentStart={setSegmentStart}
                               startSegment={gamethree.startSegment}
                               setSegmentEnd={setSegmentEnd}
                               advanceSegment={advanceSegment}
                               endOfRoundThree={endOfRoundThree}
                               currentTranscript={gamethree.currentTranscript}
                               gameLength={gamethree.transcripts.length - 1}
                               phrasesLength={gamethree.transcripts[gamethree.currentTranscript].phrases_length - 1}
                               advanceTranscript={advanceTranscript}
                               resetSegments={resetSegments}
                               setSkipPhrase={skipPhrase}
                               skipPhrase={gamethree.skipPhrase}
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
            
            {gamethree.inGameTip ? (
              <GameTip 
                dismissTip={this.props.showTipThree}
                text={'Intructions for game three go here'} 
              />
            ) : (
              ''
            )}
          </div>
           <GameFooter
            gameNumber={gamethree.gameNumber}
            gameName={gamethree.gameName}
            canGoBack={gamethree.canGoBack}
            handleProgress={this.handleProgress}
            max={gamethree.gameLength - 1}
            value={gamethree.gameProgress}
            waitingUpdate={this.props.waitingUpdate}
            waiting={gamethree.disableProgress}
            modalIsOpen={this.props.initialData.modalIsOpen}
            setModal={this.props.setModal}
          />
        </div>        
      )
    }
  }
}
export default GameThree;