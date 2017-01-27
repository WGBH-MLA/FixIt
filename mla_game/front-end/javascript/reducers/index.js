import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import initialData from './initial_data'
import gameScores from './score'
import gameOne from './game_one'
import gameTwo from './game_two'
import gameThree from './game_three'

const rootReducer = combineReducers({
  initialData,
  gameScores,
  gameOne,
  gameTwo,
  gameThree,
  routing: routerReducer
})

export default rootReducer; 