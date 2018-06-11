import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LayoutAnimation, StyleSheet, View } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { actions as authActions } from '../../providers/auth';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Messages from '../../constants/Messages';

class LoginForm extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    handleFormChange: PropTypes.func.isRequired
  }

  state = {
    authError: '',
    confirmPassword: '',
    email: '',
    password: '',
    isConfirmPasswordValid: true,
    isEmailValid: true,
    isPasswordValid: true,
    isRegistrationFlow: false,
    showLoading: false
  }

  defaultState = () => {
    return {
      authError: '',
      confirmPassword: '',
      email: '',
      password: '',
      isAccountCreated: false,
      isConfirmPasswordValid: true,
      isEmailValid: true,
      isPasswordValid: true,
      isRegistrationFlow: false,
      showLoading: false
    };
  }

  handleEmailChange = (val) => this.setState({ email: val })
  handlePasswordChange = (val) => this.setState({ password: val })
  handleConfirmPasswordChange = (val) => this.setState({ confirmPassword: val })
  handleFormChange = () => this.setState({
    ...this.defaultState,
    isRegistrationFlow: !this.state.isRegistrationFlow
  })

  submitLoginForm = async () => {
    this.setState({ showLoading: true });
    const authInfo = await this.props.actions.auth.loginWithCredential(this.state.email, this.state.password);
    if (!authInfo) return;

    if (authInfo.message) {
      this.setState({ authError: authInfo.message, showLoading: false });
    } else if (!authInfo.emailVerified) {
      this.props.handleFormChange();
    }
  }

  submitRegistrationForm = async () => {
    const { actions, handleFormChange } = this.props;
    const {
      email,
      isEmailValid,
      isPasswordValid,
      isConfirmPasswordValid,
      password
    } = this.state;

    this._validateEmail();
    this._validatePassword();
    this._validateConfirmPassword();

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) return;

    this.setState({ showLoading: true });

    const authInfo = await actions.auth.signUpWithEmailAndPassword(email, password);
    if (!authInfo) return;

    if (authInfo.message) {
      this.setState({ authError: authInfo.message, showLoading: false });
    } else if (!authInfo.emailVerified) {
      handleFormChange();
    }
  }

  _validateEmail = () => {
    const { email } = this.state;

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = re.test(email);
    LayoutAnimation.easeInEaseOut();

    this.setState({ isEmailValid });
    return isEmailValid ? this.passwordInput.focus() : this.emailInput.shake();
  }

  _validatePassword = () => {
    const { isRegistrationFlow, password } = this.state;

    const re = /^([a-zA-Z0-9@\-_*#]{8,20})$/;
    const isPasswordValid = re.test(password);
    LayoutAnimation.easeInEaseOut();
    this.setState({ isPasswordValid });

    return isPasswordValid ? (isRegistrationFlow && this.confirmPasswordInput.focus()) : this.passwordInput.shake();
  }

  _validateConfirmPassword = () => {
    const { password, confirmPassword } = this.state;

    const isConfirmPasswordValid = password === confirmPassword;
    LayoutAnimation.easeInEaseOut();
    this.setState({ isConfirmPasswordValid });

    return isConfirmPasswordValid || this.confirmPasswordInput.shake();
  }

  render() {
    const {
      email,
      isConfirmPasswordValid,
      isEmailValid,
      isRegistrationFlow,
      isPasswordValid,
      password,
      confirmPassword,
      authError,
      showLoading
    } = this.state;

    const userIcon = (<Icon name="user-o" color={Colors.white} size={25} />);
    const lockIcon = (<Icon name="lock" color={Colors.white} size={25} />);
    const btnGradient = {
      colors: [Colors.accentColor, Colors.accentColorLight],
      start: [1, 0],
      end: [0.2, 0]
    };

    return (
      <View style={styles.formView}>
        <Input
          leftIcon={userIcon}
          containerStyle={styles.inputContainerOuter}
          inputContainerStyle={styles.inputContainerInner}
          inputStyle={styles.input}
          onChangeText={this.handleEmailChange}
          value={email}
          keyboardAppearance="light"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          ref={input => (this.emailInput = input)}
          onSubmitEditing={this._validateEmail}
          placeholderTextColor="white"
          errorStyle={styles.error}
          errorMessage={isEmailValid ? null : Messages.emailValidation}
        />
        <Input
          leftIcon={lockIcon}
          containerStyle={styles.inputContainerOuter}
          inputContainerStyle={styles.inputContainerInner}
          inputStyle={styles.input}
          onChangeText={this.handlePasswordChange}
          value={password}
          secureTextEntry
          keyboardAppearance="light"
          placeholder="Password"
          autoCapitalize="none"
          keyboardType="default"
          returnKeyType={isRegistrationFlow ? 'next' : 'done'}
          ref={input => (this.passwordInput = input)}
          onSubmitEditing={this._validatePassword}
          placeholderTextColor="white"
          errorStyle={styles.error}
          errorMessage={isPasswordValid ? null : Messages.passwordValidation}
        />
        { isRegistrationFlow &&
          <Input
            leftIcon={lockIcon}
            containerStyle={styles.inputContainerOuter}
            inputContainerStyle={styles.inputContainerInner}
            inputStyle={styles.input}
            onChangeText={this.handleConfirmPasswordChange}
            value={confirmPassword}
            secureTextEntry
            keyboardAppearance="light"
            placeholder="Confirm password"
            autoCapitalize="none"
            keyboardType="default"
            returnKeyType="done"
            ref={input => (this.confirmPasswordInput = input)}
            onSubmitEditing={isRegistrationFlow ? this._validateConfirmPassword : null}
            placeholderTextColor="white"
            errorStyle={styles.error}
            errorMessage={isConfirmPasswordValid ? null : Messages.confirmPasswordValidation}
          />
        }
        <Button
          title={isRegistrationFlow ? 'SIGN UP' : 'LOG IN'}
          activeOpacity={1}
          linearGradientProps={btnGradient}
          onPress={isRegistrationFlow ? this.submitRegistrationForm : this.submitLoginForm}
          loading={showLoading}
          loadingProps={{ size: 'small', color: 'white' }}
          disabled={!email || !password}
          buttonStyle={styles.button}
          containerStyle={styles.buttonContainer}
          titleStyle={styles.buttonTitle}
        />
        <Text style={styles.createAccount} onPress={this.handleFormChange}>
          { isRegistrationFlow ? Messages.haveAccount : Messages.createAccount }
        </Text>
        <Text style={styles.error}>{ authError }</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    width: Layout.window.width,
    height: 250,
    backgroundColor: 'transparent'
  },
  formView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainerOuter: {
    marginVertical: 5
  },
  inputContainerInner: {
    borderColor: Colors.white
  },
  input: {
    marginLeft: 10,
    color: 'white'
  },
  label: {
    color: Colors.white
  },
  loginHereText: {
    color: Colors.white,
    fontSize: 16
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 5
  },
  buttonTitle: {
    fontWeight: 'bold',
    color: 'white'
  },
  button: {
    alignSelf: 'center',
    height: 50,
    width: 250,
    borderWidth: 0,
    borderRadius: 50
  },
  createAccount: {
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold'
  },
  error: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accentColorDark
  }
});

export default connect(null, (dispatch) => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch)
    }
  };
})(LoginForm);