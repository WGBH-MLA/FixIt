function userMessages(state = {
  messageMenu:true,
  messagePreferences:true
}, action) {
  switch(action.type){
    // case 'SET_MENU_MESSAGE':
    //   return {...state, 
    //     messageMenu:action.bool
    //   }
    // case 'SET_PREFERENCES_MESSAGE':
    //   return {...state, 
    //     messagePreferences:action.bool
    //   }
    default:
      return state;
  }
}
export default userMessages;