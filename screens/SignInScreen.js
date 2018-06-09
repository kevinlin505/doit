import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ImageBackground,
  KeyboardAvoidingView,
  LayoutAnimation,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Input,
  Text
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { actions as authActions } from '../providers/auth';
import { actions as userActions } from '../providers/user';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Messages from '../constants/Messages';
import BG_IMAGE from '../assets/images/login_screen.jpg';

class SignInScreen extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  state = {
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
  }

  componentDidMount() {
    this.setState(this.defaultState());
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
    const error = await this.props.actions.auth.loginWithCredential(this.state.email, this.state.password);

    if (!error) this.props.navigation.navigate('Main');
    this.setState({ authError: error });
  }

  submitRegistrationForm = async () => {
    try {
      const user = await this.props.actions.auth.signUpWithEmailAndPassword(this.state.email, this.state.password);

      // Send user an email verification if account created successfully.
      if (user) await this.props.actions.auth.sendEmailVerification();

      this.setState({ isAccountCreated: true });
    } catch (error) {
      this.setState({ authError: error.message });
    }
  }

  _validateEmail = () => {
    const { email } = this.state;

    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmailValid = re.test(email);
    LayoutAnimation.easeInEaseOut();

    this.setState({ isEmailValid });
    return isEmailValid || this.emailInput.shake();
  }

  _validatePassword = () => {
    const { password } = this.state;

    const re = /^([a-zA-Z0-9@\-_*#]{8,20})$/;
    const isPasswordValid = re.test(password);
    LayoutAnimation.easeInEaseOut();
    this.setState({ isPasswordValid });

    return isPasswordValid || this.passwordInput.shake();
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
      authError,
      showLoading
    } = this.state;

    const userIcon = (<Icon name="user-o" color="rgba(171, 189, 219, 1)" size={25} />);
    const lockIcon = (<Icon name="lock" color="rgba(171, 189, 219, 1)" size={25} />);
    const btnGradient = {
      colors: [Colors.accentColor, Colors.accentColorLight],
      start: [1, 0],
      end: [0.2, 0]
    };

    return (
      <View style={styles.container}>
        <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        >
          <KeyboardAvoidingView behavior="position">
            <View style={styles.loginContainer}>
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
                  returnKeyType="done"
                  ref={input => (this.passwordInput = input)}
                  onSubmitEditing={this._validateConfirmPassword}
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
                    value={password}
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
                <Text style={styles.error}>{ authError }</Text>
                <Button
                  title={isRegistrationFlow ? 'SIGN UP' : 'LOG IN'}
                  activeOpacity={1}
                  linearGradientProps={btnGradient}
                  onPress={this.submitLoginForm}
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
              </View>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: Layout.window.width,
    height: Layout.window.height,
    justifyContent: 'center',
    alignItems: 'center'
  },
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
    borderColor: Colors.dividerColor
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
    color: Colors.accentColor
  }
});

export default connect(null, (dispatch) => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
      user: bindActionCreators(userActions, dispatch)
    }
  };
})(SignInScreen);
