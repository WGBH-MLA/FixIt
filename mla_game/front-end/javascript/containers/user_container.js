import React from 'react'
import User from '../components/user'

class UseContainer extends React.Component {
  
  constructor(){
    super();
    this._getData = this._getData.bind(this); 
    this.state = {
      userName:'',
    }
  }
  _getData() {
    $.ajax({
      url:`/api/profile/${currentUser}`
    })
    .then(function(data) {
      data = data[0];
      this.setState({
        userName:data.username
      });
      console.log(data);
    }.bind(this)); 
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <User userName={this.state.userName} />
    )
  }
}

export default UseContainer;