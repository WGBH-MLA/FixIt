import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import { getUserEndpoint } from './helpers'

//import the root reducer
 import rootReducer from './reducers/index'

const loggerMiddleware = createLogger()

const score = {
  totalScore:205
}

// set state
const defaultState = {
  score
};

export default function configureStore(defaultState) {
  return createStore(
    rootReducer,
    defaultState,
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
}
