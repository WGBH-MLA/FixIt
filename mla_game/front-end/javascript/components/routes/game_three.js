import React from 'react'
import { Link } from 'react-router'
import GameLoader from '../partials/game_loader'
import GameMeta from '../partials/game_meta'
import Audio from '../partials/audio'
import Phrase from '../partials/game_three_phrase'
import Paging from '../partials/paginator'
import { postData } from '../../helpers'
import GameFooter from '../partials/game_footer'
import GameTip from '../partials/game_tip'
import MenuFooter from '../partials/menu_footer'


class GameThree extends React.Component{
  constructor(){
    super()
    this.handleProgress = this.handleProgress.bind(this)
    this.activePhrase = this.activePhrase.bind(this)
    this.playPhrase = this.playPhrase.bind(this)
    this.selectPhrase = this.selectPhrase.bind(this)
    this.selectDownVotes = this.selectDownVotes.bind(this)
    this.setActive = this.setActive.bind(this)
    this.removePhrase = this.removePhrase.bind(this)
    this.reload = this.reload.bind(this)

    this.state = {
      phrase:null,
      active:null,
      down_votes:[]
    }

  }

  selectDownVotes(array){
    this.setState({down_votes:array})
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
    const { details, wait, advanceTranscript, advanceSegmentThree, gamethree, updateTotalScore, updateGameScore, updateGameProgressThree } = this.props
    let currentTranscriptLength = gamethree.transcripts[gamethree.currentTranscript].phrases_length - 1
    let noCorrectionExists = this.state.phrase == null
    
    // map and post down votes from state
    this.state.down_votes.map((index, elem) => {
      postData('/api/transcriptphrasecorrectionvote/', index)
    })

    if(gamethree.segment <= currentTranscriptLength) {
      if(gamethree.skipPhrase) {
        advanceSegmentThree(2)
        updateGameProgressThree(2)
      } else {
        advanceSegmentThree(1)
        updateGameProgressThree(1)
      }
    } 
    
    // create on object for correction and push it if it exists 
    if(!noCorrectionExists) {
      //phrase data from local state
      let phraseData = {
        upvote:true,
        "transcript_phrase_correction":this.state.phrase.pk
      }
      // score data
      let phraseScore = {
        game:'3',
        score:2
      }
      // post score and phrase
      postData('/api/transcriptphrasecorrectionvote/', phraseData)
      postData('/api/score/', phraseScore)
      // update scores
      updateTotalScore(2)
      updateGameScore(2)
      this.setActive(null)
    } 
    // scrub state for phrase correction
    this.removePhrase()
    // disable progress until
    this.props.disableProgress(true)
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
    this.props.resetSegmentsThree(0)
    this.props.resetGameScoreThree(0)
    this.props.resetTranscriptThree(0)
    this.props.resetGameProgressThree(0)
    this.props.endOfRoundThree(false)
    this.props.gameReady(false)
    this.props.fetchGameThree()
    
    
    if(tipDismissed) {
      this.props.showTipThree(true)
    }
  }

  componentWillMount(){
    this.props.fetchGameThree()
  }

  componentWillUnmount(){
    // update gameone score in state
    if(!this.props.gamethree.endOfRound) {
      this.props.updateGameThreeScore(this.props.gamethree.gameScore)
    }
    // reset gamestate
    this.reload()
  }

  
  render(){
    const { gameScores, gameone, gametwo, gamethree, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegmentThree, advanceTranscriptThree, skipPhrase, setStartTime, disableProgress, resetSegmentsThree, endOfRoundThree, updateGameProgressThree} = this.props
    
    if(!this.props.gamethree.gameReady) {
      return(
        <GameLoader
          loading={this.props.gamethree.loading} 
          gameReady={this.props.gameReady}
        />        
      )
    } else {
      let isNoGameData = gamethree.transcripts.length === 0
      return (
        <div>
          {isNoGameData ? (
          <div className="grid no-data-message-container">
            <div className="no-data-message">
              <h2>Currently there is not enough content to play Game 3. Please play Game 1 to identify transcript errors or Game 2 to provide transcript fixes.</h2>
              <div className="game-links">
                <Link to="gameone">Play Game 1</Link>
                <Link to="gametwo">Play Game 2</Link>
              </div>
            </div>
          </div>
          ) : (
            <div>
              <div className='grid'>
              {gamethree.endOfRound ? (
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
                      <Link className='play-link' to="gametwo">Play</Link>
                    </li>
                    <li>
                      <h2><span className='game-number'>{gamethree.gameNumber}</span> <span className='game-name'>{gamethree.gameName}</span></h2>
                      <span className='game-score'>{gameScores.game_three_score}</span>
                      <span className='points'>Points</span>
                      <Link className='play-link' onClick={() => this.reload()}>Play</Link>
                    </li>
                  </ul>
                  <MenuFooter
                    endOfRound={'game_three'}
                    user={this.props.initialData.user[0].pk}
                    gameScore={this.props.gamethree.gameScore}
                    updateScore={this.props.updateGameThreeScore} 
                   />
                </div>
              ) : (
                <div>
                  {gamethree.transcripts.map((index, key) => {
                  // get current trancript
                  let transcript = Number(key)
                  if(transcript == gamethree.currentTranscript) {
                    return(
                      <div key={key}>              
                        {/*<pre>{JSON.stringify(this.state, null, 2)}</pre>*/}     
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
                                 selectDownVotes={this.selectDownVotes}
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
                                 advanceSegment={advanceSegmentThree}
                                 endOfRoundThree={endOfRoundThree}
                                 currentTranscript={gamethree.currentTranscript}
                                 gameLength={gamethree.transcripts.length - 1}
                                 phrasesLength={gamethree.transcripts[gamethree.currentTranscript].phrases_length - 1}
                                 updateGameProgress={updateGameProgressThree}
                                 advanceTranscript={advanceTranscriptThree}
                                 resetSegments={resetSegmentsThree}
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
            </div>
            {gamethree.endOfRound ? (
              ''
            ) : (
             <GameFooter
              gameNumber={gamethree.gameNumber}
              gameName={gamethree.gameName}
              handleProgress={this.handleProgress}
              max={gamethree.gameLength - 1}
              value={gamethree.gameProgress}
              waitingUpdate={this.props.waitingUpdate}
              waiting={gamethree.disableProgress}
              modalIsOpen={this.props.initialData.modalIsOpen}
              setModal={this.props.setModal}
              gameTipsClass={'tip-gamethree'}
              gameCookie={'gameThreeCookie'}
             />            
            )}              
            </div>
          )}
       </div>        
      )
    }
  }
}
export default GameThree;