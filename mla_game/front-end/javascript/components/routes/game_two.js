import React from 'react'
import { Link } from 'react-router'
import LoadingScreen from '../partials/loading_screen'
import GameMeta from '../partials/game_meta'
import Audio from '../partials/audio'
import Phrase from '../partials/phrase'
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
  }

  handleProgress() {
    const { wait, advanceTranscript, advanceSegment, gametwo, updateGameProgress } = this.props
    let transcriptLength = gametwo.transcripts.length - 2
    let currentTranscriptLength = gametwo.transcripts[gametwo.currentTranscript].phrases.length
    // wait(3000)
    
    if(gametwo.segment < currentTranscriptLength) {
      advanceSegment(3)
      updateGameProgress(3)
    } else {
      if(gametwo.currentTranscript <= transcriptLength) {
        advanceSegment(-currentTranscriptLength)
        advanceTranscript(1)
      }
    }
  }

  goBack() {
    const { wait, advanceTranscript, advanceSegment, gametwo, updateGameProgress } = this.props
    let transcriptLength = gametwo.transcripts.length - 2
    let currentTranscriptLength = gametwo.transcripts[gametwo.currentTranscript].phrases.length
    
    // if(gametwo.segment < currentTranscriptLength) {
    //   if(this.props.gametwo.currentTranscript >= 1) {
    //     advanceSegment(-3)
    //     updateGameProgress(-3)
    //   }
    // } else {
    //   if(gametwo.currentTranscript <= transcriptLength) {
    //     advanceSegment(-currentTranscriptLength)
    //     advanceTranscript(1)
    //   }
    // }
    
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

  componentWillMount(){
    this.props.fetchGameTwo()
  }

  
  render(){
    const { gametwo, setIsPlaying, setCurrentTime, playPhrase, selectPhrase, waitingUpdate, setSegmentEnd, setSegmentStart, advanceSegment } = this.props
    
    if(this.props.gametwo.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return(
        <div>
          <div className='grid'>
            
            <h1>
              {gametwo.currentTranscript} <br/> 
              {gametwo.segment} <br/>
              {gametwo.gameLength} <br/>
              {gametwo.gameProgress}
            </h1>
            
            {this.props.gametwo.transcripts.map((index, key) => {
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
                      let currentPhrase = gametwo.segment <= phrases + 4 && gametwo.segment >= phrases -4
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
                             wrongPhrases={gametwo.wrongPhrases}
                             setSegmentStart={setSegmentStart}
                             setSegmentEnd={setSegmentEnd}
                             advanceSegment={advanceSegment}
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