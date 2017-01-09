 // a reducer takes in two things

// 1. the action (info about what happened)
// 2. copy of current state

function user(state = {
  isFetching: false,
  user: {}
}, action) {

  // console.log(state, action);

  switch(action.type){
    case 'GET_USER':
      return {...state, 
        isFetching:true,
        user: null 
      }
    case 'GET_USER_SUCCESS':
      return {...state, 
        isFetching:false, 
        user:action.user
      }
    default:
      return state;
  }
}
export default user;