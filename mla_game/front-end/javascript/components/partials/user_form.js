import React from 'react'
import { putData } from '../../helpers'

class UserForm extends React.Component {
  constructor(){
    super()
    this.changeName = this.changeName.bind(this)
  }

  changeName(event){
    event.preventDefault();
    console.log(this.userform[0].value)
    this.props.setUsername(this.userform[0].value)
    
    let username = {
      username:this.userform[0].value
    }
    
    // putData('/api/profile', username).then(function(repsonse){
    //   console.log(response)
    // })
  }


  render(){
    return (
      <form ref={(input) => this.userform = input } onSubmit={(event) => this.changeName(event)} >
        <input type="text"/>
        <button type='submit'>Change Username</button>
      </form>
    )
  }
}
export default UserForm;