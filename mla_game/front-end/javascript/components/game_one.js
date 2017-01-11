import React from 'react'
import LoadingScreen from './loading_screen'
import GameMeta from './game_meta'
import Audio from './audio'
import Phrase from './phrase'
import Paging from './paginator'
import { postData } from '../helpers'

class GameOne extends React.Component{

  constructor(){
    super()
    this.activePhrase = this.activePhrase.bind(this)
    this.playPhrase = this.playPhrase.bind(this)
    this.handleProgress = this.handleProgress.bind(this)
    this.goBack = this.goBack.bind(this)
    this.selectPhrase = this.selectPhrase.bind(this)

    this.state = {
      wrongPhrases:{}
    }  

  }

  selectPhrase(phrase, pk, button){
    // reference state
    const wrongPhrases = {...this.state.wrongPhrases};
    // keys
    let key = `phrase-${pk}`
    let keyExists = key in wrongPhrases;
    wrongPhrases[key] = phrase;
    
    // push object to state only if it already doesn't exist
    // and set the class name accordingly
    if(keyExists){
      // remove item and set state
      delete wrongPhrases[key];
      this.setState({ wrongPhrases });
      // reset button to default state
      button.className = 'text'
    } else {
      this.setState({ wrongPhrases });
      // set button to higlighted state
      button.className = 'text highlighted'
    }
  }

  handleProgress(i) {
    const { gameone, setIsPlaying, setCurrentTime, playPhrase } = this.props

    // copy state
    const wrongPhrases = {...this.state.wrongPhrases};
    
    // update round
    if(gameone.segment <= gameone.phrases.length) {
      this.props.advanceRound(i)
      this.props.updateScore(10)
    } else {
      return
    }

    // data push for phrases if they exist
    let noPhrases = Object.keys(wrongPhrases).length === 0 && wrongPhrases.constructor === Object
    if(noPhrases) {
      return
    } 
    else {
      for(let key in wrongPhrases){
        // construct object for downvote
        let data = {
          transcript_phrase: wrongPhrases[key].pk
        }
        // helper ajax function to post downvote
        postData('/api/transcriptphrasedownvote/', data);
        this.props.updateScore(1);
      }
      // clean state
      this.setState({
        wrongPhrases:{}
      })
    }
  }

  goBack(i) {
    const { gameone } = this.props
    if(gameone.segment >= 1) {
      this.props.goBackRound(i)
    } else {
      return
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

  componentWillMount(){
    this.props.fetchGameOne()
  }
  
  render(){
    const { gameone, setIsPlaying, setCurrentTime, playPhrase, selectPhrase } = this.props
    
    if(this.props.gameone.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return(
        <div>
          <div className="grid">
            <div className='game-meta'>
              <Audio 
                isPlaying={gameone.isPlaying}
                src={gameone.media_url} 
                setCurrentTime={setCurrentTime}
                setIsPlaying={setIsPlaying}
              />
              <GameMeta 
                meta={gameone.metadata} 
                aapb_link={gameone.aapb_link} 
              />
            </div>
            <ul className="game-phrase-list">
              {gameone.phrases.map((index, key) => {
                let keys = Number(key);
                let currentRound = gameone.segment <= keys + 4 && gameone.segment >= keys -4;
                if(currentRound) {
                return(
                  <li key={key} className={this.activePhrase(gameone.currentTime, index.start_time, index.end_time)}>
                    <Phrase
                       selectPhrase={this.selectPhrase}
                       playPhrase={this.playPhrase}
                       time={gameone.currentTime} 
                       active={gameone.segment}
                       keys={key}
                       details={index}
                       wrongPhrases={gameone.wrongPhrases}
                    />
                  </li>
                 )
                }
               })}
              </ul>
          </div>
          <div className="game-footer">
            <div className="grid">
              <h2 className='title delta'><span>1</span> Identify Errors</h2>
              <div className="controls">
                <Paging 
                  goBack={this.goBack} 
                  handleProgress={this.handleProgress} 
                />                
                <progress className="game-progress" max={gameone.phrases.length} value={gameone.segment + 3}></progress>
              </div>
              <button className="help">
                <title>Help</title>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
                <path d="M90.2 120.6c-.4-4.6-.2-8.6.7-11.8.9-3.2 2.1-6 3.7-8.4 1.6-2.4 3.3-4.4 5.3-6.1 2-1.7 3.9-3.4 5.6-5 1.7-1.6 3.2-3.3 4.3-5 1.2-1.7 1.7-3.8 1.7-6.2 0-3.1-.9-5.6-2.6-7.5-1.7-1.9-4.8-2.8-9.3-2.8-1.4 0-2.9.2-4.5.5s-3.2.8-4.8 1.3c-1.6.6-3.1 1.2-4.6 2-1.5.8-2.8 1.5-3.9 2.3l-6.7-12.8c3.4-2.3 7.3-4.2 11.7-5.7 4.4-1.5 9.7-2.3 15.9-2.3 8.4 0 14.9 2 19.6 6.1 4.7 4 7.1 9.5 7.1 16.3 0 4.5-.6 8.3-1.8 11.3-1.2 3-2.7 5.5-4.5 7.6-1.8 2.1-3.7 3.9-5.9 5.5-2.1 1.6-4.1 3.3-5.9 5.1-1.8 1.8-3.3 3.9-4.5 6.3-1.2 2.4-1.9 5.5-1.9 9.2H90.2zm-2.7 19c0-3.1 1-5.6 2.9-7.4 2-1.8 4.5-2.7 7.7-2.7 3.4 0 6 .9 8 2.7 2 1.8 2.9 4.3 2.9 7.4 0 3.1-1 5.6-2.9 7.5-2 1.9-4.6 2.8-8 2.8-3.2 0-5.8-.9-7.7-2.8s-2.9-4.4-2.9-7.5z"/>
                </svg>
              </button>              
            </div>
          </div>
        </div>
      )
    }
  }

}
export default GameOne;