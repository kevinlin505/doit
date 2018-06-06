export const types = {
  UPDATE_USER: 'UPDATE_USER'
};

const initialState = {
  name: ''
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
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
  updateUser: (name) => ({ type: types.UPDATE_USER, name })
};
