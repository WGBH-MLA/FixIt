import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import initialData from './initial_data'
import gameScores from './score'
import gameOne from './game_one'
import gameTwo from './game_two'
import gameThree from './game_three'
import leaderboard from './leaderboard'

const rootReducer = combineReducers({
  initialData,
  gameScores,
  leaderboard,
  gameOne,
  gameTwo,
  gameThree,
  routing: routerReducer
})

export default rootReducer; 