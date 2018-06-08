import { AsyncStorage } from 'react-native';

export default function auth(firebase) {
  return {
    // Create an user without verification
    createUserWithEmailAndPassword: async (email, password) => {
      return firebase.auth().createUserWithEmailAndPassword(email, password);
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