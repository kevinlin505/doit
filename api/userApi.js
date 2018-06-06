import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCI0Y-Eypm0b3IHONj3rHzTM4kV37CYwco',
  authDomain: 'doit-90d46.firebaseapp.com',
  databaseURL: 'https://doit-90d46.firebaseio.com',
  projectId: 'doit-90d46',
  storageBucket: 'doit-90d46.appspot.com',
  messagingSenderId: '918750318336'
};

export const initializeFireBase = () => {
  firebase.initializeApp(config);
};

export const createTask = async (taskData) => {
  const userId = firebase.auth().currentUser.uid;
  const newTaskKey = await firebase.database().ref('/tasks').push().key;
  const updates = {};
  updates[`/tasks/${newTaskKey}`] = taskData;
  updates[`/users/${userId}/tasks/${newTaskKey}`] = taskData;

  return firebase.database().ref().update(updates);
};

export const retrieveAllUserTasksWithId = async (userId) => {
  const userValue = await firebase.database().ref(`/users/${userId}`).once('value');
  if (userValue) {
    const task1 = userValue.toJSON().tasks['0'];

    const taskInfo = await firebase.database().ref(`/tasks/${task1}`).once('value');

    console.log(task1, taskInfo.toJSON());
  }
};

export const retrieveAllUserTasks = async () => {
  const userId = firebase.auth().currentUser.uid;
  retrieveAllUserTasksWithId(userId);
};

export const retrieveDataWithCredential = async (token) => {
  // Build Firebase credential with the Facebook access token.
  const credential = firebase.auth.FacebookAuthProvider.credential(token);

  // Sign in with credential from the Facebook user.
  const user = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
  if (user) return user;

  throw new Error('No user found');
};

export const loginWithFacebookAuthAsync = async () => {
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
    return retrieveDataWithCredential(token);
  } catch (error) {
    throw new Error(error);
  }

  // Get the user's name using Facebook's Graph API
  // const response = await fetch(
  //   `https://graph.facebook.com/me?access_token=${token}`
  // );
};