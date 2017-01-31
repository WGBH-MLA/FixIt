import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createLogger from 'redux-logger'

//import the root reducer
 import rootReducer from './reducers/index'

const loggerMiddleware = createLogger()

export default function configureStore(defaultState) {
  return createStore(
    rootReducer,
    defaultState,
    applyMiddleware(
      thunk,
      // loggerMiddleware
    )
  )
}