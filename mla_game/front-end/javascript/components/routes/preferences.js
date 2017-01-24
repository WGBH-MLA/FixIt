import React from 'react'
import UserForm from '../partials/user_form'

class Preferences extends React.Component{
  
  render(){
    return (
      <div className="grid">
        <h1>{this.props.initialData.username}</h1>
        <h1>Preferences</h1>
        <UserForm 
          data={this.props.initialData}
          setUsername={this.props.setUsername}
        />
      </div>
    )
  }

};
export default Preferences;