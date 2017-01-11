require('es6-promise').polyfill();
import axios from 'axios'

// score actions
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
}// <-- end score actions
 
 //fetch initial data actions
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

export function fetchData(){
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
} // <-- end initial data actions


// gameone initial actions
function requestGameOne(bool){
  return {
    type: 'GET_GAMEONE',
    loading:bool
  }
}

function storeGameOne(data) {
  return {
    type: 'GET_GAMEONE_SUCCESS',
    data,
  }
}

export function fetchGameOne(){
  return (dispatch, getState) => {
    dispatch(requestGameOne(true))
    return axios.get('/api/transcript/random/')
      .then(function(gameOneInfo){
        dispatch(storeGameOne(gameOneInfo.data[0]))
      })
  }
} 
// gameone audio actions
export function setCurrentTime(currentTime){
  return {
    type:'SET_CURRENTTIME',
    currentTime
  }
}

export function setIsPlaying(bool){
  return {
    type:'SET_ISPLAYING',
    isPlaying:bool
  }
}

//gameone round actions
export function advanceRound(progress){
  return{
    type:'ADVANCE_ROUND',
    progress
  }
}

export function goBackRound(progress){
  return{
    type:'GOBACK_ROUND',
    progress
  }
}

export function markIncorrect(phrase){
  return{
    type:'MARK_INCORRECT',
    phrase
  }
}

export function unMarkPhrase(phrase){
  return{
    type:'UNMARK_PHRASE',
    phrase
  }
}
// <-- end  gameone actions


