function gameOne(state = {
  gameNumber:1,
  gameName:'Identify Errors',
  loading:true,
  gameReady:false,
  aapb_link:null,
  media_url: null,
  pk:null,
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
    case 'GET_GAMEONE':
      return {...state, 
        loading:true
      }
    case 'GAME_READY':
      return {...state, 
        gameReady:action.gameReady
      }
    case 'GET_GAMEONE_SUCCESS':
      return {...state, 
        loading: false,
        aapb_link:action.data.aapb_link,
        media_url:action.data.media_url,
        phrases:action.data.phrases,
        metadata:action.data.metadata,
        pk:action.data.pk
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
    case 'SET_END_ROUND_ONE':
      return  {...state, 
        endOfRound:action.bool
      }
    case 'GOBACK_ROUND':
      return  {...state, 
        segment:state.segment - action.progress
      }
    case 'RESET_SEGMENTS':
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
    case 'DISMISS_TIP_ONE':
      return  {...state, 
        inGameTip:action.bool
      }
    default:
      return state;
  }
}
export default gameOne;