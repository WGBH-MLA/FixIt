import React from 'react'
import UserForm from '../partials/user_form'

class Preferences extends React.Component{
  
  render(){
    return (
      <div className="preferences">
        <div className="user-form">
          <div className="grid">
            <span className="user">{this.props.initialData.username}</span>
            <UserForm 
              data={this.props.initialData}
              setUsername={this.props.setUsername}
            />
          </div>
        </div>
      </div>
    )
  }

};
export default Preferences;