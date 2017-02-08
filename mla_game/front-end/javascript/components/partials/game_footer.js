import React from 'react'
import Paging from './paginator'
import Modal from 'react-modal'

class GameFooter extends React.Component{
  constructor(){
    super()
    this.setModal = this.setModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  
  setModal(){
    const { modalIsOpen } = this.props
    if(modalIsOpen) {
      this.props.setModal(false)
    } else {
      this.props.setModal(true)
    }
  }

  closeModal(){
    this.props.setModal(false)
  }

  render(){
    return(
      <div className="game-footer">
        <div className="grid">
          <h2 className='title delta'><span>{this.props.gameNumber}</span> {this.props.gameName}</h2>
          <div className="controls">
            <Paging 
              goBack={this.props.goBack}
              canGoBack={this.props.canGoBack} 
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
          isOpen={this.props.modalIsOpen}
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
          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
          <p> but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
          <p>eady. Think of a news blog that's filled with content hourly on the day of going live. However, reviewers tend to be distracted by comprehensible content, say, a random text copied from a</p>
          <p>ontent. It's also called placeholder (or filler) text. It's a convenient tool for mock-ups. It helps to outline the visual elements of a document or presentation, eg typography, font, or layout. Lorem ipsum is mostly a part of a Latin </p>
        </Modal>
      </div>
    )
  }
}
export default GameFooter;