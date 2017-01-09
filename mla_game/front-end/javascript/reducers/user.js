 // a reducer takes in two things

// 1. the action (info about what happened)
// 2. copy of current state

function user(state = {
  isFetching: false,
}, action) {

  // console.log(state, action);

  switch(action.type){
    case 'GET_USER':
      return {...state, 
        isFetching:true,
      }
    case 'GET_USER_SUCCESS':
      return {...state, 
        isFetching:false, 
        pk:action.user.pk,
        preferred_stations:[action.user.preferred_stations],
        preferred_topics:[action.user.preferred_topics],
        username:action.user.username
      }
    default:
      return state;
  }
}
export default user;