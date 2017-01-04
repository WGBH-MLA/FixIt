import { combineReducers } from 'redux'
import { routerReducer} from 'react-router-redux'

import score from './score'

const rootReducer = combineReducers({ score, routing: routerReducer})

export default rootReducer; 