import * as firebase from 'firebase';
import Firebase from '../constants/Firebase';

import auth from './auth';
import group from './group';
import task from './task';
import user from './user';

const initializeFireBase = async () => {
  const config = {
    apiKey: Firebase.apiKey,
    authDomain: Firebase.authDomain,
    databaseURL: Firebase.databaseURL,
    projectId: Firebase.projectId,
    storageBucket: Firebase.storageBucket,
    messagingSenderId: Firebase.messagingSenderId
  };

  // Initialize firebase connection
  firebase.initializeApp(config);

  // State will be persisted even when the activity is destroyed in react-native.
  await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
};

export default {
  auth,
  group,
  initializeFireBase,
  task,
  user
};