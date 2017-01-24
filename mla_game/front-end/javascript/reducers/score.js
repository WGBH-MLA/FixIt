function totalScore(state = {
  total_score:null
}, action) {
  switch(action.type){
    case 'SET_TOTAL_SCORE':
      return {
        // take a copy of state
        ...state.total_score, 
        // increment score based on amount callback
        total_score:action.score
      }
    case 'UPDATE_TOTAL_SCORE':
      return {
        // take a copy of state
        ...state.total_score, 
        // increment score based on amount callback
        total_score:state.total_score + action.amount
      }
    default:
      return state;
  }
}
export default totalScore;