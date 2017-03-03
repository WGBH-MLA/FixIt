function preferences(state = {
  source:null,
  topics:null,
}, action) {
  switch(action.type){
    case 'GET_PREFERENCE_OPTIONS_SUCCESS':
      return {...state,
        source:action.source,
        topics:action.topics
      }
    default:
      return state;
  }
}
export default preferences;