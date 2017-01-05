 // a reducer takes in two things

// 1. the action (info about what happened)
// 2. copy of current state

function score(state = [], action) {
  switch(action.type){
    case 'UPDATE_SCORE' :
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
export default score;