function gameScores(state = {
  total_score:null,
  game_one_score:null,
  game_two_score:null,
  game_three_score:null,
}, action) {
  switch(action.type){
    case 'SET_TOTAL_SCORE':
      return {...state, 
        total_score:action.score
      }
    case 'SET_GAME_SCORES':
      return {...state, 
          game_one_score:action.gameone,
          game_two_score:action.gametwo,
          game_three_score:action.gamethree,
      }
    case 'UPDATE_TOTAL_SCORE':
      return {...state, 
        total_score:state.total_score + action.amount
      }
    case 'UPDATE_GAMEONE_SCORE':
      return {...state, 
        game_one_score:state.game_one_score + action.amount
      }
    case 'UPDATE_GAMETWO_SCORE':
      return {...state, 
        game_two_score:state.game_two_score + action.amount
      }
    case 'UPDATE_GAMETHREE_SCORE':
      return {...state, 
        game_three_score:state.game_three_score + action.amount
      }
    default:
      return state;
  }
}
export default gameScores;