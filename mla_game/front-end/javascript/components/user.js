import React from 'react'

class User extends React.Component {

  constructor(){
    super();
  }
  
  render(){
    return(
      <div className="grid">
        <h2>Welcome {this.props.userName}</h2>
      </div>
    )
  }
}
export default User;