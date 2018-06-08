const logger = store => next => action => {
  console.log('dispatching', action);
  const result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = () => next => action => {
  try {
    return next(action);
  } catch (err) {
    logger(err);
    throw err;
  }
};

export default crashReporter;