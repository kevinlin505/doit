import db from '../models/_db';

export const types = {
  INIT_DB_ERROR: 'AUTH/INIT_DB_ERROR',
  INIT_DB_SUCCESS: 'AUTH/INIT_DB_SUCCESS',
  SET_CURRENT_USER: 'AUTH/SET_CURRENT_USER',
  SET_EMAIL_VERIFICATION: 'AUTH/SET_EMAIL_VERIFICATION'
};

const initialState = {
  isDBConnect: false,
  isUserEmailVerify: false,
  currentUser: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.INIT_DB_ERROR: {
      return {
        ...state,
        isDBConnect: false
      };
    }

    case types.INIT_DB_SUCCESS: {
      return {
        ...state,
        isDBConnect: true
      };
    }

    case types.SET_CURRENT_USER: {
      return {
        ...state,
        currentUser: action.user
      };
    }

    case types.SET_EMAIL_VERIFICATION: {
      return {
        ...state,
        isUserEmailVerify: action.status
      };
    }

    default: return state;
  }
}

export const actions = {
  initFirebase: () => async (dispatch) => {
    try {
      await db.initializeFireBase();

      return dispatch({
        type: types.INIT_DB_SUCCESS
      });
    } catch (error) {
      return dispatch({
        type: types.INIT_DB_ERROR
      });
    }
  },

  loginWithCredential: (email, password) => async (dispatch) => {
    try {
      const user = await db.auth().signInWithEmailAndPassword(email, password);
      dispatch(actions.setEmailVerification());

      return user.user;
    } catch (error) {
      return error;
    }
  },

  loginWithFacebook: () => async (dispatch) => {
    try {
      const userInfo = await db.auth().loginWithFacebookAuthAsync();

      dispatch({
        type: types.LOGIN_SUCESS
      });

      return dispatch(actions.updateUser(userInfo.user.uid, userInfo.user.displayName));
    } catch (error) {
      return dispatch({
        type: types.LOGIN_SUCESS
      });
    }
  },

  logout: () => () => db.auth().signOut(),

  sendEmailVerification: () => async () => {
    try {
      await db.auth().sendEmailVerification();
    } catch (error) {
      console.log(error);
    }
  },

  setCurrentUser: (user) => ({ type: types.SET_CURRENT_USER, user }),

  setEmailVerification: (status) => ({ type: types.SET_EMAIL_VERIFICATION, status }),

  signUpWithEmailAndPassword: (email, password) => async (dispatch) => {
    try {
      const user = await db.auth().createUserWithEmailAndPassword(email, password);
      const profile = await db.user().createUserProfile();
      console.log(profile);

      if (user && user.user && !user.user.emailVerified) {
        dispatch(actions.sendEmailVerification());
      }

      return user.user;
    } catch (error) {
      dispatch({
        type: types.REGISTRATION_ERROR
      });

      return error;
    }
  },

  subscribeToAuthChange: (callback) => async () => {
    db.auth().onAuthStateChanged(callback);
  }
};
