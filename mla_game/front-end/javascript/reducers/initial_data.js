function initialData(state = {
  loading:true,
  username:null,
  loading_data:null,
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
        score:action.score,
        message:action.message
      }
    case 'SET_USERNAME':
      return {...state, 
        username:action.user,
      }
    case 'SET_LOADING_DATA':
      return {...state, 
        loading_data:action.loaderData,
      }
    default:
      return state;
  }
}
export default initialData;