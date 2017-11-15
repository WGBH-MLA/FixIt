import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import userMessages from './user_messages'
import initialData from './initial_data'
import leaderboard from './leaderboard'
import preferencesOptions from './preferences'
import gameScores from './score'
import gameOne from './game_one'
import gameTwo from './game_two'
import gameThree from './game_three'

const rootReducer = combineReducers({
  initialData,
  leaderboard,
  preferencesOptions,
  gameScores,
  gameOne,
  gameTwo,
  gameThree,
  userMessages,
  routing:routerReducer
})

export default rootReducer; 