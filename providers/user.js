import db from '../models/_db';

export const types = {
  GET_USER_TASKS: 'GET_USER_TASKS'
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

    default: return state;
  }
}

export const actions = {
  updateUserProfile: (user) => async () => {
    try {
      const profile = await db.user().updateUserProfile(user);
    } catch (error) {
      console.error(error);
    }
  },




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
