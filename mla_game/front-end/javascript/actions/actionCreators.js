require('es6-promise').polyfill();
import axios from 'axios'

export function updateScore(amount){
  return {
    type:'UPDATE_SCORE',
    amount
  }
}

function setTotalScore(score){
  return {
    type:'SET_TOTAL_SCORE',
    score
  }
}
 
 //score actions
function requestInitialData(bool){
  return {
    type: 'GET_INITIAL_DATA',
    loading:bool
  }
}

function storeInitialData(user, score) {
  return {
    type: 'GET_INITIAL_DATA_SUCCESS',
    user,
    score
  }
}

export function fetchData(data){
  return (dispatch, getState) => {
    dispatch(requestInitialData(true))
    return axios.all([
        axios.get('/api/profile'),
        axios.get('/api/score/')
      ])
      .then(axios.spread(function (profile, score) {
        dispatch(storeInitialData(profile.data.results, score.data.results))
        
        // set total score
        let total = [];
        for (var i = 0; i < score.data.results.length; i++) {
          total.push(score.data.results[i].score);
        }
        let totalScore = total.reduce((a, b) => a + b, 0);
        dispatch(setTotalScore(totalScore))
      }))
  }
}