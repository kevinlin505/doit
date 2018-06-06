import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
import * as firebase from 'firebase';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    clicked: false,
    updatedTitle: '',
    name: '',
    status: '',
    userId: ''
  }

  componentDidMount() {
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyCI0Y-Eypm0b3IHONj3rHzTM4kV37CYwco",
      authDomain: "doit-90d46.firebaseapp.com",
      databaseURL: "https://doit-90d46.firebaseio.com",
      projectId: "doit-90d46",
      storageBucket: "doit-90d46.appspot.com",
      messagingSenderId: "918750318336"
    };
    firebase.initializeApp(config);

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({ status: "We are authenticated now!", userId: user.uid, name: user.displayName });
      }
    });

    // this.checkCurrentUser()

    this.setupHighscoreListener();
  }

  // checkCurrentUser = () => {
  //   var userId = firebase.auth().currentUser && firebase.auth().currentUser.uid;
  //   return firebase.database().ref('/users/' + userId).once('value').then((snapshot) => {
  //     var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  //     // this.setState({ name: username });
  //   });
  // }

  handleButtonClick = () => {
    const user = firebase.auth().currentUser;
    // this.storeHighScore(userId, 55);
    // firebase.database().ref('users/' + user.uid).set({
    //   displayName: user.displayName,
    //   highscore: 4
    // });

    this.storeHighScore(user, 554);
  }

  setupHighscoreListener() {
    firebase.database().ref('tasks/task1').on('value', (snapshot) => {
      const title = snapshot.val().title;
      this.setState({ updatedTitle: title })
    });
  }

  storeHighScore(user, score) {
    if (user != null) {
      firebase.database().ref('users/' + user.uid).update({
        highscore: score
      });
    }
  }

  // 288424861584897
  logIn = async () => {
    const {
      type,
      token
    } = await Expo.Facebook.logInWithReadPermissionsAsync('1989280654717333', {
      permissions: ['public_profile']
    });
    
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch((error) => {
        // Handle Errors here.
      });

      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`
      );

      this.setState({ name: (await response.json()).name });
    }
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
          <Button onPress={this.logIn} title="Sign in to Facebook" />
          <Text>{ this.state.name }</Text>
          <Button title="Test" onPress={this.handleButtonClick}>
          </Button>
          { this.state.clicked &&
            <Text>{ this.state.updatedTitle }</Text>
          }
          <Text>{ this.state.status }</Text>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
