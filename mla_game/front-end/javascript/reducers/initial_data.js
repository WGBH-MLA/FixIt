function initialData(state = {
  loading:true,
  user:null,
  username:null,
  score:null,
  modalIsOpen:false
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
    case 'TOGGLE_MODAL':
      return {...state, 
        modalIsOpen:action.bool,
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