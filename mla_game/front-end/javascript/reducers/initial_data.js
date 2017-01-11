function initialData(state = {
  loading:true,
  user:null,
  score:null,
}, action) {
  switch(action.type){
    case 'GET_INITIAL_DATA':
      return {...state, 
        loading:true
      }
    case 'GET_INITIAL_DATA_SUCCESS':
      return {...state, 
        loading: false, 
        user:action.user,
        score:action.score
      }
    default:
      return state;
  }
}
export default initialData;