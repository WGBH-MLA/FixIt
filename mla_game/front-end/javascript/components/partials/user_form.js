import React from 'react'
import { patchData } from '../../helpers'

class UserForm extends React.Component {
  constructor(){
    super()
    this.changeName = this.changeName.bind(this)
    this.state = {
      saved:false
    }
  }

  changeName(event){
    event.preventDefault();
    // create object and url for changeing username
    let userPk = this.props.data.user[0].pk,
        emptyForm = this.userform[0].value.length == 0
    
    let username = {
      "username":this.userform[0].value
    }
    
    if(!emptyForm) {
      // patch username and update in state
      this.props.setUsername(this.userform[0].value)
      patchData(`/api/profile/${userPk}/`, username)

       // ui updates
      let self = this
      this.setState({saved:true})
      new Promise(function(resolve) {
        setTimeout(function() { 
          resolve(); 
        }, 1500)
      })
      .then(function() {
        self.setState({saved:false})
      })
    }

  }


  render(){
    return (
      <form ref={(form) => this.userform = form } onSubmit={(event) => this.changeName(event)}>
        <div className="input-container">
          <input type="text" placeholder='Change Username' />
        </div>
        <button type='submit'>Save</button>
         {this.state.saved ? (
            <span className="save-message">Username Saved</span>
          ) : (
            ''
          )}
      </form>
    )
  }
}

UserForm.proptypes = {
  setUsername:React.PropTypes.func.isRequired,
  data:React.PropTypes.object.isRequired,
}

export default UserForm;