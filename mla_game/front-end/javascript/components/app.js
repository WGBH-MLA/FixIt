import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../actions/actionCreators';
import Header from './header';

function mapStateToProps(state) {
  return {
     score: state.score,
  }
}

function mapDispachToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const Base = connect(mapStateToProps, mapDispachToProps)(Header);

export default Base;