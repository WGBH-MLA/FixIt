import React from 'react'
import Paging from './paginator'
import Modal from 'react-modal'


class GameFooter extends React.Component{
  constructor(){
    super()
    this.setModal = this.setModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.setTipsModal = this.setTipsModal.bind(this)
    this.closeTipsModal = this.closeTipsModal.bind(this)
    
    this.state = {
      modalOpen:false,
      tipsModal:false
    }
  }

  setModal(){
    let open = this.state.modalOpen
    if(open) {
      this.setState({modalOpen:false})
    } else {
      this.setState({modalOpen:true})
    }
  }

  closeModal(){
    this.setState({modalOpen:false})
  }

  setTipsModal(){
    let open = this.state.tipsModal
    if(open) {
      this.setState({tipsModal:false})
    } else {
      this.setState({tipsModal:true})
    }
  }

  closeTipsModal(){
    this.setState({tipsModal:false})
  }

  render(){
    return(
      <div className="game-footer">
        <div className="grid">
          <h2 className='title delta'><span>{this.props.gameNumber}</span> {this.props.gameName}</h2>
          <div className="controls">
            <Paging 
              handleProgress={this.props.handleProgress} 
              waitingUpdate={this.props.waitingUpdate}
              waiting={this.props.waiting}
            />                
            <progress className="game-progress" max={this.props.max} value={this.props.value}></progress>
          </div>
          <div className="help">
            <button onClick={() => this.setModal()} className="rules">Rules</button>
            <button onClick={() => this.setTipsModal()} className="tips">Tips</button>              
          </div>
        </div>
        <Modal
          isOpen={this.state.tipsModal}
          onRequestClose={this.closeTipsModal}        
          contentLabel="Game Tips"
          className="modal-content tip-modal"
          overlayClassName="modal-overlay"
        >
          <button className='modal-close' onClick={this.closeTipsModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
              <title>Close Modal</title>
              <path d="M403.1 108.9c-81.2-81.2-212.9-81.2-294.2 0s-81.2 212.9 0 294.2c81.2 81.2 212.9 81.2 294.2 0s81.2-213 0-294.2zm-12.3 281.9c-74.3 74.3-195.3 74.3-269.6 0-74.3-74.3-74.3-195.3 0-269.6s195.3-74.3 269.6 0c74.4 74.3 74.4 195.3 0 269.6z"/>
              <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
            </svg>
          </button>
          <div className={this.props.gameTipsClass}></div>
        </Modal>
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}        
          contentLabel="Game Rules"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h1>Game Rules</h1>
          <button className='modal-close' onClick={this.closeModal}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
              <title>Close Modal</title>
              <path d="M403.1 108.9c-81.2-81.2-212.9-81.2-294.2 0s-81.2 212.9 0 294.2c81.2 81.2 212.9 81.2 294.2 0s81.2-213 0-294.2zm-12.3 281.9c-74.3 74.3-195.3 74.3-269.6 0-74.3-74.3-74.3-195.3 0-269.6s195.3-74.3 269.6 0c74.4 74.3 74.4 195.3 0 269.6z"/>
              <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
            </svg>
          </button>
          <p>The recordings that you interact with in FIX IT are historic and sometimes unedited. More than 70,000 transcripts are loaded in to the game, and they include transcripts for produced programs but also recordings of raw interviews, field tapes, and even music performances. If you are presented with a transcript segment for the beginning of a recording, you may hear bars and tone before you hear any speech.</p>
          <p>When playing FIX IT, use the guidelines below as you listen and make judgment calls about errors and corrections.</p>
          <ul className="list-tips">
            <li>Transcripts should have correct punctuation throughout the transcripts.</li>
            <li>Transcripts should contain no misspellings.</li>
            <li>Contractions should be transcribed as the listener hears them, "didn't" or "shoulda." </li>
            <li>Numbers should be transcribed in numerals, "40 years old or 40th Street." </li>
            <li>Pauses and hesitations should be transcribed as the user hears them, "ah" or "um."</li>
            <li>Noise should be transcribed in brackets using descriptive language, "[tone]" or "[dog barks]."</li>
            <li>Partial words should be transcribed with as much as the speaker says followed with a dash, "Tes- testing" or "Absolu- Absolutely."</li>
            <li>
              If multiple speakers are speaking, indicate with brackets, e.g., <br/>
              [All speaking at once]: <br/>
              <strong>Bob:</strong> You shut up! <br/>
              <strong>Jim:</strong> No, you shut up! <br/>
              <strong>Nancy:</strong> You're both being stupid! <br/>
            </li>
            <li>If a speaker is speaking in a language other than English, it should be transcribed as best as possible in the appropriate language. If you are presented with audio in a language that you do not understand or do not feel comfortable working on, skip the challenge and start the game over.</li>
            <li>For songs, the title of the song should be written in brackets followed by the lyrics verbatim. If you're dealing with an instrumental piece, just the title should be written in brackets. If it's important to convey other information, such as if the piece is being played by a specific orchestra, the correct transcript should provide that info as well e.g., [Schumann's Symphony #3, Leonard Bernstein conducting the New York Philharmonic, 1968]. If you don't know the title of the music, just indicate that music is playing by typing [music] in brackets.</li>
            <li>If you do not know how to spell a word or name and you are playing the Identify Errors game, note that line as having an error. If you are playing the Suggest Fixes game and do not know how to spell the word or name, it should be transcribed as best as possible. Feel free to pause the audio and try to figure out how to spell the word. If you still cannot spell the word, spell it as best as you can.</li>
          </ul>
        </Modal>
      </div>
    )
  }
}
export default GameFooter;