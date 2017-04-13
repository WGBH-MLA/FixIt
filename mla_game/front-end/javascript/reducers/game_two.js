function gameTwo(state = {
  gameNumber:2,
  gameName:'Suggest Fixes',
  loading:true,
  currentTime:0,
  startTime:0,
  isPlaying:false,
  gameLength:null,
  gameProgress:0,
  disableProgress:true,
  segment:0,
  currentTranscript:0,
  endSegment:1,
  endOfRound:false,
  startSegment:0,
  skipPhrase:false,
  gameScore:0,
  waiting:false,
  inGameTip:true,
  transcripts:0
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
    case 'SET_CURRENTTIME':
      return {...state, 
        currentTime:action.currentTime
      }
    case 'SET_GAME_LENGTH_TWO':
      return {...state, 
        gameLength:action.data
      }
    case 'UPDATE_GAME_PROGRESS_TWO':
      return {...state, 
        gameProgress:state.gameProgress + action.data
      }
    case 'DISABLE_PROGRESS':
      return {...state, 
        disableProgress:action.bool
      }
    case 'RESET_GAME_PROGRESS_TWO':
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
    case 'RESET_GAME_SCORE_TWO':
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
    case 'ADVANCE_SEGMENT_TWO':
      return  {...state, 
        segment:state.segment + action.progress
      }
    case 'ADVANCE_TRANSCRIPT_TWO':
      return  {...state, 
        currentTranscript:state.currentTranscript + action.progress
      }
    case 'RESET_TRANSCRIPT_TWO':
      return  {...state, 
        currentTranscript:action.progress
      }
    case 'WAITING_UPDATE':
      return  {...state, 
        waiting:action.waiting
      }
    case 'SET_END_ROUND_TWO':
      return  {...state, 
        endOfRound:action.bool
      }
    case 'RESET_SEGMENTS_TWO':
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