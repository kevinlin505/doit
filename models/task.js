export default function task(firebase) {
  return {
    createTask: async (taskData) => {
      const userId = firebase.auth().currentUser.uid;
      const newTaskKey = await firebase.database().ref('/tasks').push().key;
      const updates = {};
      updates[`/tasks/${newTaskKey}`] = taskData;
      updates[`/users/${userId}/tasks/${newTaskKey}`] = taskData;

      return firebase.database().ref().update(updates);
    },

    retrieveAllUserTasksWithId: async (userId) => {
      const userValue = await firebase.database().ref(`/users/${userId}`).once('value');
      if (userValue) {
        const task1 = userValue.toJSON().tasks['0'];

        const taskInfo = await firebase.database().ref(`/tasks/${task1}`).once('value');
      }
    },

    retrieveAllUserTasks: () => {
      const userId = firebase.auth().currentUser.uid;
      this.retrieveAllUserTasksWithId(userId);
    },

    retrieveDataWithCredential: async (token) => {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      const user = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
      if (user) return user;

      throw new Error('No user found');
    }
  };
}