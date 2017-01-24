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
    let userPk = this.props.data.user[0].pk
    let username = {
      "username":this.userform[0].value
    }
    // patch username and update in state
    patchData(`/api/profile/${userPk}/`, username)
    this.props.setUsername(this.userform[0].value)
  }


  render(){
    return (
      <form ref={(input) => this.userform = input } onSubmit={(event) => this.changeName(event)}>
        <input required type="text"/>
        <button type='submit'>Change Username</button>
      </form>
    )
  }
}

UserForm.proptypes = {
  setUsername:React.PropTypes.func.isRequired,
  data:React.PropTypes.object.isRequired,
}

export default UserForm;