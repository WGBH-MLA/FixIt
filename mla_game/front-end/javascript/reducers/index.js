import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import initialData from './initial_data'
import totalScore from './score'
import gameOne from './game_one'

const rootReducer = combineReducers({
  initialData,
  totalScore,
  gameOne,
  routing: routerReducer
})

export default rootReducer; 