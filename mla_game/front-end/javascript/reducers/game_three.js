function gameThree(state = {
  gameNumber:3,
  gameName:'Validate Fixes',
  canGoBack:true,
  loading:true,
  currentTime:0,
  startTime:0,
  isPlaying:false,
  segment:0,
  currentTranscript:0,
  endSegment:0,
  endOfRound:false,
  startSegment:0,
  gameScore:0,
  waiting:false,
  inGameTip:true,
  transcriptList:null
}, action) {
  switch(action.type){
    case 'GET_GAMETHREE':
      return {...state, 
        loading:true
      }
    case 'GET_GAMETHREE_SUCCESS':
      return {...state, 
        loading: false,
        transcriptList:action.data
      }
    case 'SET_TRANSCRIPTS':
      return {...state, 
        transcriptList:action.newPhrases
      }
    case 'SET_CURRENTTIME':
      return {...state, 
        currentTime:action.currentTime
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
    case 'SET_END_ROUND':
      return  {...state, 
        endOfRound:action.endOfRound
      }
    case 'GOBACK_ROUND':
      return  {...state, 
        segment:state.segment - action.progress
      }
    case 'RESET_ROUND':
      return  {...state, 
        segment:action.progress
      }
    case 'MARK_INCORRECT':
      return  {...state.wrongPhrases,
        wrongPhrases:action.phrase
      }
    case 'UNMARK_PHRASE':
      return  {...state, 
        wrongPhrases:action.phrase
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