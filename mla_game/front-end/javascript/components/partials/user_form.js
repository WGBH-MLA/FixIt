import React from 'react'
import { patchData } from '../../helpers'

class UserForm extends React.Component {
  constructor(){
    super()
    this.changeName = this.changeName.bind(this)
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
    }
  }


  render(){
    return (
      <form ref={(form) => this.userform = form } onSubmit={(event) => this.changeName(event)}>
        <div className="input-container">
          <input type="text" placeholder='Username' />
        </div>
        <button type='submit'>Save</button>
      </form>
    )
  }
}

UserForm.proptypes = {
  setUsername:React.PropTypes.func.isRequired,
  data:React.PropTypes.object.isRequired,
}

export default UserForm;