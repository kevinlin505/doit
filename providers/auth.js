import db from '../models/_db';

export const types = {
  INIT_DB_ERROR: 'AUTH/INIT_DB_ERROR',
  INIT_DB_SUCCESS: 'AUTH/INIT_DB_SUCCESS',
  CHECK_SESSION: 'AUTH/CHECK_SESSION',
  VALIDATE_USER_ERROR: 'AUTH/VALIDATE_USER_ERROR',
  VALIDATE_USER_SUCCESS: 'AUTH/VALIDATE_USER_SUCCESS'
};

const initialState = {
  isDBConnected: false,
  isUserValidate: false,
  isSessionActive: false
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.INIT_DB_ERROR: {
      return {
        ...state,
        isDBConnected: false
      };
    }

    case types.INIT_DB_SUCCESS: {
      return {
        ...state,
        isDBConnected: true
      };
    }

    case types.CHECK_SESSION: {
      return {
        ...state,
        isSessionActive: action.status
      };
    }

    case types.VALIDATE_USER_ERROR: {
      return {
        ...state,
        isUserValidate: false
      };
    }

    case types.VALIDATE_USER_SUCCESS: {
      return {
        ...state,
        isUserValidate: true
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
  subscribeToAuthChange: (callback) => async () => {
    db.auth().onAuthStateChanged(callback);
  },
  loginWithCredential: (email, password) => async () => {
    try {
      const user = await db.auth().signInWithEmailAndPassword(email, password);

      if (user && user.user && !user.user.emailVerified) return 'Please verify your email address!';

      return false;
    } catch (error) {
      return error.message;
    }
  },
  logout: () => () => db.auth().signOut(),
  sendEmailVerification: () => () => db.auth().sendEmailVerification(),
  signUpWithEmailAndPassword: (email, password) => () => db.auth().createUserWithEmailAndPassword(email, password),

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

  validateUser: (token) => async (dispatch) => {
    if (!token) {
      dispatch({
        type: types.VALIDATE_USER,
        isValid: false
      });

      return false;
    }

    try {
      const userInfo = await db.task().retrieveDataWithCredential(token);

      dispatch({
        type: types.VALIDATE_USER,
        isValid: true
      });

      return dispatch(actions.updateUser(userInfo.user.uid, userInfo.user.displayName));
    } catch (error) {
      return dispatch({
        type: types.VALIDATE_USER,
        isValid: false
      });
    }
  }
};
