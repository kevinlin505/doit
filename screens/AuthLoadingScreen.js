import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ActivityIndicator,
  ImageBackground,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { actions as authActions } from '../providers/auth';
import { actions as userActions } from '../providers/user';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import BG_IMAGE from '../assets/images/auth_screen.jpg';

class AuthLoadingScreen extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.initDB();
  }

  // Fetch the token from storage then navigate to our appropriate place
  initDB = async () => {
    const { actions } = this.props;

    // Establish connection with db
    await actions.auth.initFirebase();

    // Check if user session still active in db
    actions.auth.subscribeToAuthChange(this.checkUserSession);
  }

  /**
   * Check if user session is live
   * This will switch to the App screen or Auth screen
   * and this loadingscreen will be unmounted and thrown away.
   */
  checkUserSession = (user) => {
    const isEmailVerify = user && user.emailVerified;

    this.props.actions.auth.setCurrentUser(user);
    this.props.actions.user.updateUserProfile({
      photoURL: 'https://lh3.googleusercontent.com/-nmXIkc4R4Kw/AAAAAAAAAAI/AAAAAAAAAAA/AB6qoq2wXeGKhdW6LAHXKNtvv0zORpaQTw/s32-c-mo/photo.jpg'
    });
    this.props.navigation.navigate(isEmailVerify ? 'Main' : 'Auth');
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={BG_IMAGE}
          style={styles.bgImage}
        >
          <ActivityIndicator size="large" color={Colors.primaryColorDark} />
          <StatusBar barStyle="default" />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bgImage: {
    flex: 1,
    top: 0,
    left: 0,
    width: Layout.window.width,
    height: Layout.window.height,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default connect(null, (dispatch) => {
  return {
    actions: {
      auth: bindActionCreators(authActions, dispatch),
      user: bindActionCreators(userActions, dispatch)
    }
  };
})(AuthLoadingScreen);