import Auth from '../constants/Auth';

export default {
  registrationValidation: (errorCode) => {
    switch (errorCode) {
      case Auth.EMAIL_IN_USE:
        return 'Email already in use!';

      case Auth.INVALID_EMAIL:
        return 'Email is invalid!';

      case Auth.OPERATION_DISABLED:
        return 'Sorry, email registration not supported!';

      case Auth.WEAK_PASSWORD:
        return 'Please choose a stronger password!';

      default:
        return '';
    }
  }
};