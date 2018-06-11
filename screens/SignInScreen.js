import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  UIManager,
  View
} from 'react-native';
import Layout from '../constants/Layout';
import BG_IMAGE from '../assets/images/auth_screen.jpg';
import LoginForm from '../components/auth/LoginForm';
import EmailForm from '../components/auth/EmailForm';

// Enable LayoutAnimation on Android
// eslint-disable-next-line
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class SignInScreen extends React.Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  state ={
    isLoginForm: true
  }

  handleFormChange = () => this.setState({ isLoginForm: !this.state.isLoginForm })

  render() {
    const { auth, navigation } = this.props;

    return (
      <View style={styles.container}>
        <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        >
          <View style={styles.overlay}>
            <KeyboardAvoidingView behavior="position">
              <View style={styles.titleContainer}>
                <View>
                  <Text style={styles.titleText}>AVOYAGE</Text>
                </View>
              </View>
              <View style={styles.loginContainer}>
                { this.state.isLoginForm && !auth.isEmailVerify ?
                  <LoginForm handleFormChange={this.handleFormChange} />
                  :
                  <EmailForm
                    auth={auth}
                    handleFormChange={this.handleFormChange}
                    navigation={navigation}
                  />
                }
              </View>
            </KeyboardAvoidingView>
          </View>
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
    height: Layout.window.height
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, .3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
    backgroundColor: 'transparent'
  },
  titleText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold'
  },
  loginContainer: {
    width: Layout.window.width,
    height: 250,
    backgroundColor: 'transparent'
  }
});

export default connect((state) => {
  return {
    auth: state.auth
  };
})(SignInScreen);
