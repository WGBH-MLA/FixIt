import React from 'react'
import Score from '../components/score'

class ScoreContainer extends React.Component {
  
  constructor(){
    super();
    this._getData = this._getData.bind(this); 
    this.state = {
      totalscore:'',
    }
  }
  _getData() {
    $.ajax({
      url:'/api/score/'
    })
    .then(function(data) {
      // get score from game objects
      let total = [];
      for (var i = 0; i < data.results.length; i++) {
        total.push(data.results[i].score);
      }
      var totalScore = total.reduce((a, b) => a + b, 0);
      // set score state
      this.setState({
        totalScore:totalScore
      });

    }.bind(this)); 
  }

  componentDidMount() {
    this._getData();
  }

  render() {
    return (
      <div>
        <Score score={this.state.totalScore} />
      </div>
    )
  }
}

export default ScoreContainer;