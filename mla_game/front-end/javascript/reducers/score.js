 // a reducer takes in two things

// 1. the action (info about what happened)
// 2. copy of current state

function score(state = [], action) {
  console.log(state, action);

  
  switch(action.type){
    case 'UPDATE_SCORE' :
    default:
      return state;
  }
}

export default score;