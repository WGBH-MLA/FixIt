import React from 'react'
import classNames from 'classnames'

class Corrections extends React.Component {
  constructor(){
    super()
    this.selectVote = this.selectVote.bind(this);

    this.state = {
      corrected_vote:0,
    }

  }
  
  selectVote(text, pk){
    const vote = {...this.state}
    let phrase ={
      text:text,
      pk:pk
    }
    this.props.selectPhrase(phrase)
    this.props.setActive(pk)
    this.setState({
      corrected_vote:pk
    })
  }

  render(){
    let currentlySelected = this.state.corrected_vote === this.props.active
    let voteState = classNames({
      'vote-option':true,
      'vote': currentlySelected
    })

    return(
      <div className="vote-options">
        <button className={voteState} ref={(button) => {this.button = button}} onClick={()=> this.selectVote(this.button.textContent, this.button.id)} id={this.props.pk}>{this.props.text}</button>
        {currentlySelected ? (
          <div className='phrase-editing'>
            <button className='correct-phrase' onClick={() => this.props.savePhrase()}>Save</button>
            <button className='correct-phrase' onClick={() => this.props.cancel()}>Cancel</button>
          </div>
        ):(
          ''
        )}
      </div>
    )
  }
}
export default Corrections;