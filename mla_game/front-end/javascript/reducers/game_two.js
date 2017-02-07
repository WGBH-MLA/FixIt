function gameTwo(state = {
  gameNumber:2,
  gameName:'Suggest Fixes',
  canGoBack:false,
  loading:true,
  currentTime:0,
  startTime:0,
  isPlaying:false,
  gameLength:null,
  gameProgress:3,
  segment:0,
  currentTranscript:0,
  endSegment:1,
  endOfRound:false,
  startSegment:0,
  skipPhrase:false,
  gameScore:0,
  waiting:false,
  inGameTip:true,
  transcripts:null
}, action) {
  switch(action.type){
    case 'GET_GAMETWO':
      return {...state, 
        loading:true
      }
    case 'GET_GAMETWO_SUCCESS':
      return {...state, 
        loading: false,
        transcripts:action.data
      }
    case 'SET_TRANSCRIPTS':
      return {...state, 
        phrases:action.data
      }
    case 'SET_CURRENTTIME':
      return {...state, 
        currentTime:action.currentTime
      }
    case 'SET_GAME_LENGTH':
      return {...state, 
        gameLength:action.data
      }
    case 'UPDATE_GAME_PROGRESS':
      return {...state, 
        gameProgress:state.gameProgress + action.data
      }
    case 'RESET_GAME_PROGRESS':
      return {...state, 
        gameProgress:action.data
      }
    case 'SKIP_CORRECT_PHRASE':
      return {...state, 
        skipPhrase:action.bool
      }
    case 'SET_STARTTIME':
      return {...state, 
        startTime:action.startTime
      }
    case 'SET_ISPLAYING':
      return {...state, 
        isPlaying:action.isPlaying
      }
    case 'UPDATE_GAME_SCORE':
      return {...state, 
        gameScore:state.gameScore + action.amount
      }
    case 'RESET_GAME_SCORE':
      return {...state, 
        gameScore:action.amount
      }
    case 'SET_SEGMENT_START':
      return {...state,
        startSegment:action.segmentStart
      }
    case 'SET_SEGMENT_END':
      return {...state,
        endSegment:action.segmentEnd
      }
    case 'ADVANCE_SEGMENT':
      return  {...state, 
        segment:state.segment + action.progress
      }
    case 'ADVANCE_TRANSCRIPT':
      return  {...state, 
        currentTranscript:state.currentTranscript + action.progress
      }
    case 'WAITING_UPDATE':
      return  {...state, 
        waiting:action.waiting
      }
    case 'SET_END_ROUND_TWO':
      return  {...state, 
        endOfRound:action.bool
      }
    case 'RESET_SEGMENTS':
      return  {...state, 
        segment:action.progress
      }
    case 'DISMISS_TIP_TWO':
      return  {...state, 
        inGameTip:action.bool
      }
    default:
      return state;
  }
}
export default gameTwo;