import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import initialData from './initial_data'
import gameScores from './score'
import gameOne from './game_one'
import gameTwo from './game_two'

const rootReducer = combineReducers({
  initialData,
  gameScores,
  gameOne,
  gameTwo,
  routing: routerReducer
})

export default rootReducer; 