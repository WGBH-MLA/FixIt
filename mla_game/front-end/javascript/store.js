import { createStore, compse } from 'redux'
import { syncHistoryWithStore } from 'react-router-redux'
import { browserHistory } from 'react-router'


//import the root reducer
 import rootReducer from './reducers/index'

 const score = {
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "score": 5,
      "game": "1"
    },
    {
      "score": 50,
      "game": "2"
    },
    {
      "score": 150,
      "game": "3"
    }
  ]
}

let total = [];
for (var i = 0; i < score.results.length; i++) {
  total.push(score.results[i].score);
}
var totalScore = total.reduce((a, b) => a + b, 0);

score.results.push({
  totalScore:totalScore,
  game:'total'
})




// set state
 
 const defaultState = {
    score
 };

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);
export default store;

