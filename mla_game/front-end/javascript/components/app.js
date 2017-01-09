import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Base from './base';

function mapStateToProps(state) {
  return {
     score: state.score,
     user: state.user
  }
}

function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const BaseConnect = connect(mapStateToProps, mapDispachToProps)(Base);

export default BaseConnect;