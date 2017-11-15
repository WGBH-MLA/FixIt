import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Base from './base';


// remove warning for contentEditable
console.error = (function() {
  var error = console.error
  return function(exception) {
    if ((exception + '').indexOf('Warning: A component is `contentEditable`') != 0) {
      error.apply(console, arguments)
    }
  }
})()



function mapStateToProps(state) {
  return {
    initialData:state.initialData,
    leaderboard:state.leaderboard,
    preferencesOptions:state.preferencesOptions,
    gameScores:state.gameScores,
    gameone:state.gameOne,
    gametwo:state.gameTwo,  
    gamethree:state.gameThree,
    userMessages:state.userMessages
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

const BaseConnect = connect(mapStateToProps, mapDispatchToProps)(Base);

export default BaseConnect;