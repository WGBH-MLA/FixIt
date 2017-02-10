function leaderboard(state = {
  past_month:null,
  past_week:null,
  all_time:null,
  game_one_all_time:null,
  game_two_all_time:null,
  game_three_all_time:null
}, action) {
  switch(action.type){
    case 'SET_LEADERBOARD':
      return {...state, 
        past_month:action.past_month,
        past_week:action.past_week,
        all_time:action.all_time,
        game_one_all_time:action.game_one_all_time,
        game_two_all_time:action.game_two_all_time,
        game_three_all_time:action.game_three_all_time
      }
    default:
      return state;
  }
}
export default leaderboard;