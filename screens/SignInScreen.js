import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { actions as userActions } from '../providers/user';

class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in'
  };

  static propTypes = {
    actions: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  state = {
    loginError: ''
  }

  _signInAsync = async () => {
    try {
      await this.props.actions.user.loginWithFacebook();
      this.props.navigation.navigate('Main');
    } catch (error) {
      this.setState({ loginError: `Sign in error!: ${error}` });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        { this.state.loginError &&
          <Text>{ this.state.loginError }</Text>
        }
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default connect(null, (dispatch) => {
  return {
    actions: {
      user: bindActionCreators(userActions, dispatch)
    }
  };
})(SignInScreen);
