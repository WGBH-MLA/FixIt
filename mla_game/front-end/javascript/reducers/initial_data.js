function initialData(state = {
  loading:true,
  username:null,
  modalIsOpen:false,
  modalIsOpenAbout:false
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
    case 'SET_USERNAME':
      return {...state, 
        username:action.user,
      }
    default:
      return state;
  }
}
export default initialData;