import React from 'react'

class User extends React.Component {

  constructor(){
    super();
  }
  
  render(){
    return(
      <div className="grid">
        <h2 className='welcome-message'>Welcome <span>{this.props.userName}</span></h2>
      </div>
    )
  }
}
export default User;