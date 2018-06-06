import {
  createTask,
  initializeFireBase,
  loginWithFacebookAuthAsync,
  retrieveAllUserTasksWithId,
  retrieveDataWithCredential
} from '../api/userApi';

export const types = {
  GET_USER_TASKS: 'GET_USER_TASKS',
  LOGIN_SUCESS: 'LOGIN_SUCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  VALIDATE_USER: 'VALIDATE_USER'
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
      await createTask(taskData);
    } catch (error) {
      throw error;
    }
  },

  getUserTasks: () => async (dispatch, getState) => {
    const userId = getState().user.id;
    const tasks = await retrieveAllUserTasksWithId(userId);

    return dispatch({
      type: types.GET_USER_TASKS,
      tasks
    });
  },

  loginWithFacebook: () => async (dispatch) => {
    try {
      const userInfo = await loginWithFacebookAuthAsync();

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
      initializeFireBase();
      const userInfo = await retrieveDataWithCredential(token);

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
