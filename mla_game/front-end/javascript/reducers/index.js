import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import score from './score'
import user from './user'

const rootReducer = combineReducers({
  score, 
  user, 
  routing: routerReducer
})

export default rootReducer; 