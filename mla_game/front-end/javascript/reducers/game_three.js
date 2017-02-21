function gameThree(state = {
  gameNumber:3,
  gameName:'Validate Fixes',
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
  transcripts:null
}, action) {
  switch(action.type){
    case 'GET_GAMETHREE':
      return {...state, 
        loading:true
      }
    case 'GET_GAMETHREE_SUCCESS':
      return {...state, 
        loading: false,
        transcripts:action.data
      }
    case 'SET_CURRENTTIME':
      return {...state, 
        currentTime:action.currentTime
      }
    case 'SET_GAME_LENGTH_THREE':
      return {...state, 
        gameLength:action.data
      }
    case 'UPDATE_GAME_PROGRESS_THREE':
      return {...state, 
        gameProgress:state.gameProgress + action.data
      }
    case 'DISABLE_PROGRESS':
      return {...state, 
        disableProgress:action.bool
      }
    case 'RESET_GAME_PROGRESS_THREE':
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
    case 'RESET_GAME_SCORE_THREE':
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
    case 'ADVANCE_SEGMENT_THREE':
      return  {...state, 
        segment:state.segment + action.progress
      }
    case 'ADVANCE_TRANSCRIPT_THREE':
      return  {...state, 
        currentTranscript:state.currentTranscript + action.progress
      }
    case 'RESET_TRANSCRIPT_THREE':
      return  {...state, 
        currentTranscript:action.progress
      }
    case 'WAITING_UPDATE':
      return  {...state, 
        waiting:action.waiting
      }
    case 'SET_END_ROUND_THREE':
      return  {...state, 
        endOfRound:action.bool
      }
    case 'RESET_SEGMENTS_THREE':
      return  {...state, 
        segment:action.progress
      }
    case 'DISMISS_TIP_THREE':
      return  {...state, 
        inGameTip:action.bool
      }
    default:
      return state;
  }
}
export default gameThree;