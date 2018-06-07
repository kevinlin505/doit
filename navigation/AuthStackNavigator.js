import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen';
import CustomSignInScreen from '../screens/CustomSignInScreen';

export default createStackNavigator({
  SignIn: CustomSignInScreen
});