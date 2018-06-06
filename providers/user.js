export const types = {
  UPDATE_USER: 'UPDATE_USER',
  LOGIN_FACEBOOK: 'LOGIN_FACEBOOK'
};

const initialState = {
  name: ''
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case types.LOGIN_FACEBOOK: {
      return {
        ...state,
        name: action.name
      };
    }
    
    case types.UPDATE_USER: {
      return {
        ...state,
        name: action.name
      };
    }

    default: return state;
  }
}

export const actions = {
  updateUser: (name) => ({ type: types.UPDATE_USER, name }),
  loginWithFacebook: () => dispatch => {
    
  }
};
