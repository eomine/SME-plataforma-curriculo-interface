import React from 'react';
import { connect } from 'react-redux';
import LoginActions from 'actions/LoginActions';

class Redirect extends React.Component {
  render() {
    const { location } = this.props;

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');

    this.props.login(token);

    return (
      <></>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    login: (token) => {
      dispatch(LoginActions.tokenLogin(token));
    },
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Redirect);
