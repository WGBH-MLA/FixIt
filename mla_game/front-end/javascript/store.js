import { createStore, compse } from 'redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'


//import the root reducer
 import rootReducer from './reducers/index'

const score = {
  totalScore:205
}

// set state
const defaultState = {
  score
};

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);
export default store;

