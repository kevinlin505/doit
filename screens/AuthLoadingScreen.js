import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { actions as userActions } from '../providers/user';

class AuthLoadingScreen extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  componentDidMount() {
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const { actions, navigation } = this.props;

    const firebaseStatus = await actions.user.initFirebase();
    const userToken = await AsyncStorage.getItem('userToken');
    const isValidated = await actions.user.validateUser(userToken);

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    navigation.navigate(isValidated ? 'Main' : 'Auth');
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
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
})(AuthLoadingScreen);