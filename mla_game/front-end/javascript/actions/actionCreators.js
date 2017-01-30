require('es6-promise').polyfill();
import axios from 'axios'

// score actions
export function updateTotalScore(amount){
  return {
    type:'UPDATE_TOTAL_SCORE',
    amount
  }
}

export function updateGameScore(amount){
  return {
    type:'UPDATE_GAME_SCORE',
    amount
  }
}

export function updateGameOneScore(amount){
  return {
    type:'UPDATE_GAMEONE_SCORE',
    amount
  }
}

export function updateGameTwoScore(amount){
  return {
    type:'UPDATE_GAMETWO_SCORE',
    amount
  }
}

export function updateGameThreeScore(amount){
  return {
    type:'UPDATE_GAMETHREE_SCORE',
    amount
  }
}


export function resetGameScore(amount){
  return {
    type:'RESET_GAME_SCORE',
    amount
  }
}

function setGameScores(gameone, gametwo, gamethree){
  return {
    type:'SET_GAME_SCORES',
    gameone, 
    gametwo, 
    gamethree
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

export function setUsername(user) {
  return {
    type: 'SET_USERNAME',
    user,
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
        const { game_scores, username } = profile.data.results[0]
        dispatch(storeInitialData(profile.data.results, score.data.results))
        // set username
        dispatch(setUsername(username))
        // set total score
        dispatch(setTotalScore(game_scores.total_score))
        dispatch(setGameScores(game_scores.game_one_score, game_scores.game_two_score, game_scores.game_three_score))
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
        // store data for gameone
        dispatch(storeGameOne(gameOneInfo.data[0]))
        // set start time for for audio based on start time of first phrase
        dispatch(setStartTime(Number(gameOneInfo.data[0].phrases[0].start_time)))
        // set end time based on forst phrase start time
        let transcriptEndTime = Number(gameOneInfo.data[0].phrases[0].start_time) + 1200
        // grab first twenty minutes of segments and push 
        // to new array and then state
        const phrases = [];
        for (var i = 0; i < gameOneInfo.data[0].phrases.length; i++) {
          if(gameOneInfo.data[0].phrases[i].start_time <= transcriptEndTime) {
            phrases.push(gameOneInfo.data[0].phrases[i]);
          }
        }
        // update state with new phrase array with twenty minutes of audio
        dispatch(setPhraseList(phrases))
      })
  }
} 
// gameone audio actions
export function setStartTime(startTime){
  return {
    type:'SET_STARTTIME',
    startTime
  }
}

export function setCurrentTime(currentTime){
  return {
    type:'SET_CURRENTTIME',
    currentTime
  }
}

export function setSegmentStart(segmentStart){
  return {
    type:'SET_SEGMENT_START',
    segmentStart
  }
}

export function setSegmentEnd(segmentEnd){
  return {
    type:'SET_SEGMENT_END',
    segmentEnd
  }
}

// for grabbing the first twent minutes for game round
function setPhraseList(newPhrases) {
  return {
    type: 'SET_PHRASE_LIST',
    newPhrases
  }
}

export function setIsPlaying(bool){
  return {
    type:'SET_ISPLAYING',
    isPlaying:bool
  }
}

//gameone round actions
export function endOfRound(bool){
  return {
    type:'SET_END_ROUND',
    endOfRound:bool
  }
}

export function waitingUpdate(bool){
  return{
    type:'WAITING_UPDATE',
    waiting:bool
  }
}

export function wait(time){
  return (dispatch, getState) => {
    dispatch(waitingUpdate(true));
    new Promise(function(resolve) {
      setTimeout(function() { 
        resolve(); 
      }, time);
    })
    .then(function() {
      dispatch(waitingUpdate(false));
    });
  }
}

export function advanceSegment(progress){
  return{
    type:'ADVANCE_SEGMENT',
    progress
  }
}

export function advanceTranscript(progress){
  return{
    type:'ADVANCE_TRANSCRIPT',
    progress
  }
}

export function goBackRound(progress){
  return{
    type:'GOBACK_ROUND',
    progress
  }
}

export function resetRound(progress){
  return{
    type:'RESET_ROUND',
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
// <-- end gameone actions

//Modal window and in Game Tip
export function setModal(bool){
  return {
    type:'TOGGLE_MODAL',
    bool
  }
}

export function dismissTipOne(bool){
  return {
    type:'DISMISS_TIP_ONE',
    bool
  }
}

export function dismissTipTwo(bool){
  return {
    type:'DISMISS_TIP_TWO',
    bool
  }
}// <-- end Modal window and in Game Tip

// gametwo initial actions
function requestGameTwo(bool){
  return {
    type: 'GET_GAMETWO',
    loading:bool
  }
}

function storeGameTwo(data){
  return {
    type: 'GET_GAMETWO_SUCCESS',
    data,
  }
}

function setTranscriptList(data){
  return {
    type: 'SET_TRANSCRIPTS',
    data,
  }
}
export function fetchGameTwo(){
  return (dispatch, getState) => {
    dispatch(requestGameTwo(true))
    return axios.get('/api/transcript/game_two/')
      .then(function(gameTwoInfo){
        // add a length value to each transcript for changing transcript
        let data = gameTwoInfo.data
        for (var i = 0; i < data.length; i++) {
          data[i].phrases_length = data[i].phrases.length
        }
        // store data for gametwo
        dispatch(storeGameTwo(data))
        // set start time for for audio based on start time of first phrase
        dispatch(setStartTime(Number(data[0].phrases[0].start_time)))
      })
  }
}// <-- end  gametwo actions

// gamethree initial actions

