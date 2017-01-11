function totalScore(state = {
  totalScore:null
}, action) {
  switch(action.type){
    case 'SET_TOTAL_SCORE':
      return {
        // take a copy of state
        ...state.totalScore, 
        // increment score based on amount callback
        totalScore:action.score
      }
    case 'UPDATE_SCORE':
      return {
        // take a copy of state
        ...state.totalScore, 
        // increment score based on amount callback
        totalScore:state.totalScore + action.amount
      }
    default:
      return state;
  }
}
export default totalScore;