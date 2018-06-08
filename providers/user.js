import db from '../models/_db';

export const types = {
  GET_USER_TASKS: 'GET_USER_TASKS',
  LOGIN_SUCESS: 'LOGIN_SUCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',

  SIGNUP_USER: 'SIGNUP_USER',
  UPDATE_USER: 'UPDATE_USER',
  VALIDATE_USER: 'VALIDATE_USER',

  INIT_FIREBASE: 'INIT_FIREBASE'
};

const initialState = {};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_USER_TASKS: {
      return {
        ...state,
        task: action.tasks
      };
    }

    case types.LOGIN_SUCESS: {
      return {
        ...state,
        isLoginSuccess: true
      };
    }

    case types.LOGIN_ERROR: {
      return {
        ...state,
        isLoginSuccess: false
      };
    }

    case types.SIGNUP_USER: {
      return {
        ...state,
        ...action
      };
    }

    case types.UPDATE_USER: {
      return {
        ...state,
        id: action.id,
        name: action.name
      };
    }

    case types.VALIDATE_USER: {
      return {
        ...state,
        isUserValidate: action.isValid
      };
    }

    case types.INIT_FIREBASE: {
      return {
        ...state,
        ...action
      };
    }

    default: return state;
  }
}

export const actions = {
  createATask: (taskData = {}) => async (dispatch, getState) => {
    taskData.creator = {
      id: getState().user.id,
      name: getState().user.name
    };

    try {
      await db.task().createTask(taskData);
    } catch (error) {
      throw error;
    }
  },

  getUserTasks: () => async (dispatch, getState) => {
    const userId = getState().user.id;
    const tasks = await db.task().retrieveAllUserTasksWithId(userId);

    return dispatch({
      type: types.GET_USER_TASKS,
      tasks
    });
  },

  signUpWithEmailAndPassword: (email, password) => (dispatch) => {
    dispatch({
      type: types.SIGNUP_USER
    });

    return db.auth().createUserWithEmailAndPassword(email, password);
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

  initFirebase: () => async (dispatch) => {
    dispatch({
      type: types.INIT_FIREBASE
    });

    return db.initializeFireBase();
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
  },

  updateUser: (id, name) => ({ type: types.UPDATE_USER, id, name })
};
