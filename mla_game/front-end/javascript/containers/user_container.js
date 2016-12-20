import React from 'react'
import User from '../components/user'

class UseContainer extends React.Component {
  
  constructor(){
    super();
    this._getData = this._getData.bind(this); 
    this.state = {
      
    }
  }
  _getData() {
    $.ajax({
      url:`/api/profile/${currentUser}`
    })
    .then(function(data) {
      this.setState({
      });
      console.log(data);
    }.bind(this)); 
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <User  />
    )
  }
}

export default UseContainer;