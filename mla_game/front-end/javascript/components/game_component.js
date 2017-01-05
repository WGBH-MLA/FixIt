import React from 'react'
import Audio from '../components/audio_component'
import GameMeta from '../components/game_meta'
import Submit from '../components/submitPhrase_component'
import Phrase from '../components/phrase'
import LoadingScreen from '../components/loadingscreen'
import Paging from '../components/paginator'
import {getCookie} from '../helpers'

class GameUi extends React.Component{

  constructor(){
    super();  
    this._syncAudio = this._syncAudio.bind(this); 
    this._playPhrase = this._playPhrase.bind(this);
    this._delayRender = this._delayRender.bind(this);
    this._handleProgress = this._handleProgress.bind(this);
    this._goBack = this._goBack.bind(this);
    this._renderGame = this._renderGame.bind(this);
    this._selectPhrase = this._selectPhrase.bind(this);
    this._setAudio = this._setAudio.bind(this);
    
    this.state = {
      currentTime:0,
      isPlaying:false,
      loaded:false,
      index:0,
      wrongPhrases:{}
    }
  }

  _selectPhrase(phrase, pk, button){
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
  
  _syncAudio(time) {
    this.setState({
      currentTime:time,
    })
  }

  _setAudio(callback){
    this.setState({
      isPlaying:callback
    })
  }
  
  _playPhrase(callback){
    var media = document.querySelector('.audio-player');
    media.currentTime = callback;
    media.play();
  }

  _delayRender() {
    this.setState({
      loaded:true
    })
  }

  _handleProgress(i) {
    // copy state
    const wrongPhrases = {...this.state.wrongPhrases};
    
    // update round
    if(this.state.index <= this.props.phrases.length) {
      let update = i + this.state.index;
      this.setState({
        index:update
      })
      this.props.updateScore(10);
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
        let data = wrongPhrases[key].pk;
        $.ajax({
          url: '/api/transcriptphrasedownvote/',
          type: 'POST',
          data: {
            transcript_phrase:data
          },
          headers: {
            // csrftoken token?
            "X-CSRFToken": getCookie('csrftoken')
           }
        })
        .done(function(response) {
          console.log(response)
        })
        .fail(function(response) {
          console.log(response);
        })
        this.props.updateScore(1);
      }
      // clean state
      this.setState({
        wrongPhrases:{}
      })
    }
  }


  
  _goBack(i) {
    if(this.state.index >= 1) {
      let update = this.state.index - i;
      this.setState({
        index:update
      })
    } else {
      return
    }
  }
  
  _renderGame(){
    if(this.state.loaded) {
      return(
        <div>
          <div className="grid">
            <div className='game-meta'>
              <Audio
               _setAudio={this._setAudio}
               _syncAudio={this._syncAudio}
                src={this.props.media_url} 
                isPlaying={this.state.isPlaying} 
                index={this.state.index}
              />
              <GameMeta meta={this.props.meta} aapb_link={this.props.aapb_link} />
            </div>
            
            <ul className="game-phrase-list">
            {this.props.phrases.map((index, key) =>{
              return(
              <Phrase key={key} 
                _playPhrase={this._playPhrase} 
                _selectPhrase={this._selectPhrase}
                 time={this.state.currentTime} 
                 active={this.state.index}
                 keys={key}
                 details={index}
                 wrongPhrases={this.state.wrongPhrases}
              />)
            })}
            </ul>
          </div>  
          <div className="game-footer">
            <div className="grid">
              <h2 className='title delta'><span>1</span> Identify Errors</h2>
              <div className="controls">
                <Paging _goBack={this._goBack} _handleProgress={this._handleProgress} />                
                <progress className="game-progress" max={this.props.phrases.length} value={this.state.index + 3}></progress>
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
    } else {
      return(
        <LoadingScreen />
      )
    }
  }

  componentDidMount(){
    setTimeout(this._delayRender, 1000); 
  }


  render(){
    return (
      this._renderGame()
    )
  }
}

export default GameUi;