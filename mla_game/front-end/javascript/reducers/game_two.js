function gameTwo(state = {
  loading:true,
  aapb_link:null,
  media_url: null,
  phrases: [],
  metadata:{},
  currentTime:0,
  startTime:0,
  isPlaying:false,
  segment:0,
  endSegment:0,
  endOfRound:false,
  startSegment:0,
  gameScore:0,
  waiting:false,
  inGameTip:true
}, action) {
  switch(action.type){
    case 'GET_GAMETWO':
      return {...state, 
        loading:true
      }
    case 'GET_GAMETWO_SUCCESS':
      return {...state, 
        loading: false,
        aapb_link:action.data.aapb_link,
        media_url:action.data.media_url,
        phrases:action.data.phrases,
        metadata:action.data.metadata,
      }
    case 'SET_PHRASE_LIST':
      return {...state, 
        phrases:action.newPhrases
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
    case 'DISMISS_TIP':
      return  {...state, 
        inGameTip:action.bool
      }
    default:
      return state;
  }
}
export default gameTwo;