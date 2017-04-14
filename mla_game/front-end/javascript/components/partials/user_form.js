import React from 'react'
import { patchData } from '../../helpers'

class UserForm extends React.Component {
  constructor(){
    super()
    this.changeName = this.changeName.bind(this)
    this.state = {
      saved:false,
      usernameError:false
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
      let self = this
      patchData(`/api/profile/${userPk}/`, username)
        .then(() => {
          // patch username and update in state
          self.props.setUsername(self.userform[0].value)
          
          // ui updates
          self.setState({saved:true})
          new Promise(function(resolve) {
            setTimeout(function() { 
              resolve(); 
            }, 1500)
          })
          .then(function() {
            self.setState({saved:false})
          })

        })
        .catch((error) => {
          if (error.response) {
            let userNameError = 'This field must be unique.' == error.response.data.username[0]
            if(userNameError) {
              // ui updates
              self.setState({usernameError:true})
              new Promise(function(resolve) {
                setTimeout(function() { 
                  resolve(); 
                }, 3000)
              })
              .then(function() {
                self.setState({usernameError:false})
              })
            }
          }
        })

    }

  }


  render(){
    return (
      <form ref={(form) => this.userform = form } onSubmit={(event) => this.changeName(event)}>
        <div className="input-container">
          {this.state.usernameError ? (
            <span className="error-message">This username is already taken. Please choose another.</span>
          ) : (
            ''
          )}
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