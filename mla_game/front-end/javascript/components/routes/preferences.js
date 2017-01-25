import React from 'react'
import UserForm from '../partials/user_form'

class Preferences extends React.Component{
  
  render(){
    return (
      <div className="grid">
        <h1>Preferences</h1>

        <h4>Your Username: <span className="username">{this.props.initialData.username}</span></h4>
        <UserForm 
          data={this.props.initialData}
          setUsername={this.props.setUsername}
        />
      </div>
    )
  }

};
export default Preferences;