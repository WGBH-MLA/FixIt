import React from 'react'
import Paging from './paginator'
import Modal from 'react-modal'

class GameFooter extends React.Component{
  constructor(){
    super()
    this.setModal = this.setModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
    
    this.state = {
      modalOpen:false
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
          <button onClick={() => this.setModal()} className="help">
            <title>Help</title>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
            <path d="M100 200C44.9 200 0 155.1 0 100S44.9 0 100 0s100 44.9 100 100-44.9 100-100 100zm0-180.4c-44.3 0-80.4 36.1-80.4 80.4 0 44.3 36.1 80.4 80.4 80.4s80.4-36.1 80.4-80.4c0-44.3-36.1-80.4-80.4-80.4z"/>
            <path d="M90.2 120.6c-.4-4.6-.2-8.6.7-11.8.9-3.2 2.1-6 3.7-8.4 1.6-2.4 3.3-4.4 5.3-6.1 2-1.7 3.9-3.4 5.6-5 1.7-1.6 3.2-3.3 4.3-5 1.2-1.7 1.7-3.8 1.7-6.2 0-3.1-.9-5.6-2.6-7.5-1.7-1.9-4.8-2.8-9.3-2.8-1.4 0-2.9.2-4.5.5s-3.2.8-4.8 1.3c-1.6.6-3.1 1.2-4.6 2-1.5.8-2.8 1.5-3.9 2.3l-6.7-12.8c3.4-2.3 7.3-4.2 11.7-5.7 4.4-1.5 9.7-2.3 15.9-2.3 8.4 0 14.9 2 19.6 6.1 4.7 4 7.1 9.5 7.1 16.3 0 4.5-.6 8.3-1.8 11.3-1.2 3-2.7 5.5-4.5 7.6-1.8 2.1-3.7 3.9-5.9 5.5-2.1 1.6-4.1 3.3-5.9 5.1-1.8 1.8-3.3 3.9-4.5 6.3-1.2 2.4-1.9 5.5-1.9 9.2H90.2zm-2.7 19c0-3.1 1-5.6 2.9-7.4 2-1.8 4.5-2.7 7.7-2.7 3.4 0 6 .9 8 2.7 2 1.8 2.9 4.3 2.9 7.4 0 3.1-1 5.6-2.9 7.5-2 1.9-4.6 2.8-8 2.8-3.2 0-5.8-.9-7.7-2.8s-2.9-4.4-2.9-7.5z"/>
            </svg>
          </button>              
        </div>
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={this.closeModal}        
          contentLabel="Help FAQ"
          className="modal-content"
          overlayClassName="modal-overlay"
        >
          <h1>Help Information</h1>
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