import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Base from './base';

function mapStateToProps(state) {
  return {
    initialData:state.initialData,
    totalScore:state.totalScore
  }
}

function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const BaseConnect = connect(mapStateToProps, mapDispachToProps)(Base);

export default BaseConnect;