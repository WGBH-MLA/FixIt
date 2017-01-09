import { getUserEndpoint } from '../helpers'
 //play pause audio
export function updateScore(amount){
  return {
    type: 'UPDATE_SCORE',
    amount,
  }
}

// user business
function storeUser(user) {
  return {
    type: 'GET_USER_SUCCESS',
    user
  }
}

function requestUser(user){
  return {
    type: 'GET_USER',
    user
  }
}

export function fetchUser(user){
  return (dispatch, getState) => {
    dispatch(requestUser(user))
    return getUserEndpoint().then(function(data){
      dispatch(storeUser(data.data.results[0]))
    })
  }
}