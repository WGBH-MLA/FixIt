import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Base from './base';

function mapStateToProps(state) {
  return {
    initialData:state.initialData,
    gameScores:state.gameScores, 
    gameone:state.gameOne,
    gametwo:state.gameTwo 
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

const BaseConnect = connect(mapStateToProps, mapDispatchToProps)(Base);

export default BaseConnect;