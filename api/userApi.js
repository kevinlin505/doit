import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import Firebase from '../constants/Firebase';

// Initialize Firebase
const config = {
  apiKey: Firebase.apiKey,
  authDomain: Firebase.authDomain,
  databaseURL: Firebase.databaseURL,
  projectId: Firebase.projectId,
  storageBucket: Firebase.storageBucket,
  messagingSenderId: Firebase.messagingSenderId
};

const API = {
  initializeFireBase: async () => {
    // Initialize firebase connection
    firebase.initializeApp(config);

    // State will be persisted even when the activity is destroyed in react-native.
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  },

  createTask: async (taskData) => {
    const userId = firebase.auth().currentUser.uid;
    const newTaskKey = await firebase.database().ref('/tasks').push().key;
    const updates = {};
    updates[`/tasks/${newTaskKey}`] = taskData;
    updates[`/users/${userId}/tasks/${newTaskKey}`] = taskData;

    return firebase.database().ref().update(updates);
  },

  retrieveAllUserTasksWithId: async (userId) => {
    const userValue = await firebase.database().ref(`/users/${userId}`).once('value');
    if (userValue) {
      const task1 = userValue.toJSON().tasks['0'];

      const taskInfo = await firebase.database().ref(`/tasks/${task1}`).once('value');
    }
  },

  retrieveAllUserTasks: () => {
    const userId = firebase.auth().currentUser.uid;
    this.retrieveAllUserTasksWithId(userId);
  },

  retrieveDataWithCredential: async (token) => {
    // Build Firebase credential with the Facebook access token.
    const credential = firebase.auth.FacebookAuthProvider.credential(token);

    // Sign in with credential from the Facebook user.
    const user = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
    if (user) return user;

    throw new Error('No user found');
  },

  loginWithFacebookAuthAsync: async () => {
    const {
      type,
      token
    } = await Expo.Facebook.logInWithReadPermissionsAsync('1989280654717333', {
      permissions: ['public_profile']
    });

    if (type !== 'success') {
      throw new Error('Facebook login permission denied!');
    }

    try {
      await AsyncStorage.setItem('userToken', token);
      return this.retrieveDataWithCredential(token);
    } catch (error) {
      throw new Error(error);
    }

    // Get the user's name using Facebook's Graph API
    // const response = await fetch(
    //   `https://graph.facebook.com/me?access_token=${token}`
    // );
  },

  // Create an user without verification
  createUserWithEmailAndPassword: async (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }
};

export default API;
