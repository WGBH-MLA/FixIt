import React from 'react'
import { Link } from 'react-router'
import LoadingScreen from '../partials/loading_screen'
import GameMeta from '../partials/game_meta'
import Audio from '../partials/audio'
import Phrase from '../partials/phrase'
import Paging from '../partials/paginator'
import { postData } from '../../helpers'
import GameFooter from '../partials/game_footer'

class GameTwo extends React.Component{

  constructor(){
    super()
  }
  
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