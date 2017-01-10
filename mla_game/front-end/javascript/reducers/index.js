import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import initialData from './initial_data'
import totalScore from './score'

const rootReducer = combineReducers({
  initialData,
  totalScore,
  routing: routerReducer
})

export default rootReducer; 