import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Button,
  StyleSheet,
  View
} from 'react-native';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements';
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
    email: '',
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

  handleInputChange = (event) => {

    this.setState({ email: event.target.value });
  }

  render() {
    return (
      <View style={styles.container}>
        <FormLabel>Email</FormLabel>
        <FormInput value={this.state.email} onChangeText={this.handleInputChange} />
        <FormLabel>Password</FormLabel>
        <FormInput value={this.state.password} onChangeText={this.handleInputChange} />
        <FormValidationMessage>{ this.state.loginError }</FormValidationMessage>
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
