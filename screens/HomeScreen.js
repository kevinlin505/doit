import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  AsyncStorage,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { WebBrowser } from 'expo';
import { actions as userActions } from '../providers/user';

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  static propTypes = {
    actions: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  }

  componentDidMount() {
  }

  handleButtonClick = () => {
    // const user = firebase.auth().currentUser;
    // this.storeHighScore(userId, 55);
    // firebase.database().ref('users/' + user.uid).set({
    //   displayName: user.displayName,
    //   highscore: 4
    // });

    // this.storeHighScore(user, 554);
  }

  logout = () => {
    AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
  }

  // setupHighscoreListener() {
  //   firebase.database().ref('tasks/task1').on('value', (snapshot) => {
  //     const title = snapshot.val().title;
  //     this.setState({ updatedTitle: title })
  //   });
  // }

  // storeHighScore(user, score) {
  //   if (user != null) {
  //     firebase.database().ref('users/' + user.uid).update({
  //       highscore: score
  //     });
  //   }
  // }

  createTask = async () => {
    const title = 'Buy food';
    const status = 'Open';
    const body = 'Buy steak and chicken wings';

    const task = {
      title,
      status,
      body
    };

    await this.props.actions.user.createATask(task);
  }

  getMyTask = async () => {
    await this.props.actions.user.getUserTasks();
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <Text>{ this.props.user.name }</Text>
          <Button title="Get my tasks" onPress={this.getMyTask} />
          <Button title="Create a task" onPress={this.createTask} />
          <Button title="Logout" onPress={this.logout} />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingTop: 30
  }
});

export default connect((state) => {
  return {
    user: state.user
  };
}, (dispatch) => {
  return {
    actions: {
      user: bindActionCreators(userActions, dispatch)
    }
  };
})(HomeScreen);
