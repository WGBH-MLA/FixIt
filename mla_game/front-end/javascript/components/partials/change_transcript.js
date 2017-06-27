import React from 'react'
import { patchData } from '../../helpers'

class ChangeTranscript extends React.Component {

  constructor(){
    super()
    this.confirm = this.confirm.bind(this)
    this.blacklistTranscript = this.blacklistTranscript.bind(this)

    this.state = {
      confirmChange:false,
    }  
  }

  confirm(){
    if(this.state.confirmChange) {
      this.setState({confirmChange:false})
    } else {
      this.setState({confirmChange:true})
    }    
  }

  blacklistTranscript(){
    let pk = this.props.pk,
        user = this.props.user,
        url = `/api/profile/${user}/skip_transcript/`,
        data = {'transcript':pk}
    patchData(url, data).then((resp)=>{
      console.log(resp);
      this.props.reload()
    })
  }
  
  render(){
    let ui
    if(this.state.confirmChange) {
      ui = <div className='confirm'>
            <button className='dismiss' onClick={() => this.confirm()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <title>Dismiss</title>
                  <path d="M340.2 160l-84.4 84.2-84-83.8-11.8 11.8 84 83.8-84 83.8 11.8 11.8 84-83.8 84.4 84.2 11.8-11.8-84.4-84.2 84.4-84.2"/>
                </svg>
            </button>
            <p>Want to try a different transcript?</p>
            <button onClick={() => this.blacklistTranscript()}>Yes</button>
            <button onClick={() => this.confirm()}>No</button>
           </div>
    }
    else {
      ui = <button className='change-transcript-button' onClick={() => this.confirm()}>Try another transcript</button>
    }

    return(
      <div className='change-transcript'>
        {ui}
      </div>
    )
  }
}
export default ChangeTranscript;