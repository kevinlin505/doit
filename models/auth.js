import * as firebase from 'firebase';
import { AsyncStorage } from 'react-native';

export default function auth() {
  return {
    // Send an email to user for email verification
    sendEmailVerification: (actionCodeSettings = {}) => firebase.auth().currentUser.sendEmailVerification(actionCodeSettings),

    // Create an user without verification
    createUserWithEmailAndPassword: (email, password) => firebase.auth().createUserWithEmailAndPassword(email, password),

    // Login with email and password
    signInWithEmailAndPassword: (email, password) => firebase.auth().signInWithEmailAndPassword(email, password),

    // Logout current user
    signOut: () => firebase.auth().signOut(),

    // Listener for auth change
    onAuthStateChanged: (callback) => {
      return firebase.auth().onAuthStateChanged(callback);
    },

    // Login with FB account
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
    }
  };
}