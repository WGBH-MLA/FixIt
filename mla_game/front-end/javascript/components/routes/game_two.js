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
    const { details, wait, advanceTranscript, advanceSegmentTwo, gametwo, updateTotalScore, updateGameScore, updateGameProgressTwo } = this.props
    let currentTranscriptLength = gametwo.transcripts[gametwo.currentTranscript].phrases_length - 1
    let noCorrectionExists = this.state.phrase == null

    if(gametwo.segment <= currentTranscriptLength) {
      if(gametwo.skipPhrase) {
        advanceSegmentTwo(2)
        updateGameProgressTwo(2)
      } else {
        advanceSegmentTwo(1)
        updateGameProgressTwo(1)
      }
    } 
    
    // create on object for correction and push it if it exists 
    if(!noCorrectionExists) {
      //phrase data from local state
      let phraseData = this.state.phrase

      // score data
      let phraseScore = {
        game:'2',
        score:2
      }
      // post score and phrase
      postData('/api/transcriptphrasecorrection/', phraseData)
      postData('/api/score/', phraseScore)
      // update scores
      updateTotalScore(2)
      updateGameScore(2)
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
    this.props.resetSegmentsTwo(0)
    this.props.resetGameScoreTwo(0)
    this.props.resetTranscriptTwo(0)
    this.props.resetGameProgressTwo(0)
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
    const { gameScores, gameone, gametwo, gamethree, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegmentTwo, advanceTranscriptTwo, skipPhrase, setStartTime, disableProgress, resetSegmentsTwo, endOfRoundTwo, updateGameProgress } = this.props
    if(this.props.gametwo.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      let isNoGameData = gametwo.transcripts.length === 0
      return(
        <div>
         {isNoGameData ? (
          <div className="grid no-data-message-container">
              <div className="no-data-message">
                <h2>Currently there is not enough content to play Game 2. Please play Game 1 to identify transcript errors or Game 3 to validate transcript fixes.</h2>
                <div className="game-links">
                  <Link to="gameone">Play Game 1</Link>
                  <Link to="gamethree">Play Game 3</Link>
                </div>
            </div>
          </div>
          ) : (
          <div>
            <div className='grid'>
            {gametwo.endOfRound ? (
              <div className='roundup'>
                <h2 className="user-message">{this.props.initialData.user[0].username} Just Scored: {gameone.gameScore} Points</h2>
                <ul className='game-navigation'>
                  <li>
                    <h2><span className='game-number'>{gameone.gameNumber}</span> <span className='game-name'>{gameone.gameName}</span></h2>
                    <span className='game-score'>{gameScores.game_one_score}</span>
                    <span className='points'>Points</span>
                    <Link className='play-link' to="gameone">Play</Link>
                  </li>
                  <li>
                    <h2><span className='game-number'>{gametwo.gameNumber}</span> <span className='game-name'>{gametwo.gameName}</span></h2>
                    <span className='game-score'>{gameScores.game_two_score}</span>
                    <span className='points'>Points</span>
                    <Link className='play-link' onClick={() => this.reload()}>Play</Link>
                  </li>
                  <li>
                    <h2><span className='game-number'>{gamethree.gameNumber}</span> <span className='game-name'>{gamethree.gameName}</span></h2>
                    <span className='game-score'>{gameScores.game_three_score}</span>
                    <span className='points'>Points</span>
                    <Link className='play-link' to="gamethree">Play</Link>
                  </li>
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
                               advanceSegment={advanceSegmentTwo}
                               endOfRoundTwo={endOfRoundTwo}
                               currentTranscript={gametwo.currentTranscript}
                               gameLength={gametwo.transcripts.length - 1}
                               phrasesLength={gametwo.transcripts[gametwo.currentTranscript].phrases_length - 1}
                               updateGameProgress={updateGameProgress}
                               advanceTranscript={advanceTranscriptTwo}
                               resetSegments={resetSegmentsTwo}
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
            </div>
            {gametwo.endOfRound ? (
              ''
            ) : (
             <GameFooter
              gameNumber={gametwo.gameNumber}
              gameName={gametwo.gameName}
              canGoBack={gametwo.canGoBack}
              handleProgress={this.handleProgress}
              max={gametwo.gameLength}
              value={gametwo.gameProgress}
              waitingUpdate={this.props.waitingUpdate}
              waiting={gametwo.disableProgress}
              modalIsOpen={this.props.initialData.modalIsOpen}
              setModal={this.props.setModal}
              gameTipsClass={'tip-gametwo'}
             />              
            )}
          </div>
          )}
        </div>
      )
    }
  }
}

export default GameTwo;