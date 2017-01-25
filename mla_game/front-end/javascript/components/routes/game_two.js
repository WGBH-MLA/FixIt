import React from 'react'
import LoadingScreen from '../partials/loading_screen'
import axios from 'axios'

class GameTwo extends React.Component{

  componentWillMount(){
    this.props.fetchGameTwo()
  }
  
  render(){
    if(this.props.gametwo.loading) {
      return(
        <LoadingScreen />
      )
    } else {
      return(
        <div>
          <div className='grid'>
            <h1>Game Two</h1>
            <pre>{JSON.stringify(this.props.gametwo, null, 2)}</pre>
          </div>
        </div>
      )
    }
  }
}

export default GameTwo;