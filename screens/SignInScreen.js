import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  LayoutAnimation,
  StyleSheet,
  View
} from 'react-native';
import {
  Button,
  Input
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { actions as userActions } from '../providers/user';
import Colors from '../constants/Colors';
import BG_IMAGE from '../assets/images/login_screen.jpg';

class SignInScreen extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  state = {
    confirmationPassword: '',
    email: '',
    password: '',
    isConfirmationPasswordValid: true,
    isEmailValid: true,
    isPasswordValid: true,
    showLoading: false
  }

  _signInAsync = async () => {
    try {
      await this.props.actions.user.loginWithFacebook();
      this.props.navigation.navigate('Main');
    } catch (error) {
      this.setState({ loginError: `Sign in error!: ${error}` });
    }
  };

  handleInputChange = (val) => this.setState({ email: val })
  handlePasswordChange = (val) => this.setState({ password: val })

  submitLoginCredentials = () => {

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

    const isPasswordValid = password.length >= 8;
    LayoutAnimation.easeInEaseOut();
    this.setState({ isPasswordValid });
    return isPasswordValid || this.passwordInput.shake();
  }

  _validateConfirmationPassword = () => {
    const { password, confirmationPassword } = this.state
    const isConfirmationPasswordValid = password === confirmationPassword
    LayoutAnimation.easeInEaseOut()
    this.setState({ isConfirmationPasswordValid })
    isConfirmationPasswordValid || this.confirmationPasswordInput.shake()
    return isConfirmationPasswordValid
  }

  render() {
    const { email, isEmailValid, isPasswordValid, password, showLoading } = this.state;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        >
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.loginContainer}>
              <View style={styles.loginInput}>
                <Input
                  leftIcon={
                    <Icon
                      name="user-o"
                      color="rgba(171, 189, 219, 1)"
                      size={25}
                    />
                  }
                  containerStyle={styles.inputContainer}
                  onChangeText={this.handleEmailChange}
                  value={email}
                  inputStyle={styles.input}
                  keyboardAppearance="light"
                  placeholder="Email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  ref={input => this.emailInput = input}
                  onSubmitEditing={this._validateEmail}
                  placeholderTextColor="white"
                  errorStyle={styles.error}
                  errorMessage={isEmailValid ? null : "Please enter a valid email address"}
                />
                <Input
                  leftIcon={
                    <Icon
                      name="lock"
                      color="rgba(171, 189, 219, 1)"
                      size={25}
                    />
                  }
                  containerStyle={styles.inputContainer}
                  onChangeText={this.handlePasswordChange}
                  value={password}
                  inputStyle={styles.input}
                  secureTextEntry
                  keyboardAppearance="light"
                  placeholder="Password"
                  autoCapitalize="none"
                  keyboardType="default"
                  returnKeyType="done"
                  ref={input => this.passwordInput = input}
                  onSubmitEditing={this._validatePassword}
                  placeholderTextColor="white"
                  errorStyle={styles.error}
                  errorMessage={isPasswordValid ? null : "Password need to be at least 8 characters"}
                />
              </View>
              <Button
                title="LOG IN"
                activeOpacity={1}
                linearGradientProps={{
                  colors: [Colors.accentColor, Colors.accentColorLight],
                  start: [1, 0],
                  end: [0.2, 0]
                }}
                onPress={this.submitLoginCredentials}
                loading={showLoading}
                loadingProps={{ size: 'small', color: 'white' }}
                disabled={!email && password.length < 8}
                buttonStyle={styles.button}
                containerStyle={styles.buttonContainer}
                titleStyle={styles.buttonTitle}
              />
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </View>
    );
  }
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginContainer: {
    width: SCREEN_WIDTH,
    height: 220,
    backgroundColor: 'transparent'
  },
  loginInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    marginLeft: 10,
    color: 'white'
  },
  inputContainer: {
    marginVertical: 10
  },
  label: {
    color: Colors.white
  },
  loginHereText: {
    color: Colors.white,
    fontSize: 16
  },
  buttonContainer: {
    flex: -1
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
  error: {
    textAlign: 'center',
    fontSize: 12
  }
});

export default connect(null, (dispatch) => {
  return {
    actions: {
      user: bindActionCreators(userActions, dispatch)
    }
  };
})(SignInScreen);
