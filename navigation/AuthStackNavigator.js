import { createStackNavigator } from 'react-navigation';
import SignInScreen from '../screens/SignInScreen';
import CustomSignInScreen from '../screens/CustomSignInScreen';
import CustomLoginScreen from '../screens/CustomLoginScreen';

export default createStackNavigator({
  SignIn: SignInScreen
}, {
  headerMode: 'none',
  mode: 'modal',
  navigationOptions: {
    gesturesEnabled: false
  }
});