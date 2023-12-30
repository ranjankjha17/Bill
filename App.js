import { NavigationContainer } from '@react-navigation/native'; 
import { createStackNavigator } from '@react-navigation/stack'; 
import { Provider } from 'react-redux';
import store from './store/store';
import {  StyleSheet} from 'react-native';
import {ErrorBoundary} from 'react-error-boundary'
import { View,Text } from 'react-native';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Main } from './pages/Main';

const Stack = createStackNavigator();

function ErrorHandler() {
  return (
    <View role="alert">
      <Text>An error occurred:</Text>
      {/* <Text>{error.message}</Text> */}
     
    </View>
  )
}


export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Dashboard} />
          <Stack.Screen name="Main" component={Main} />
          <Stack.Screen name="Register" component={AdminDashboard} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef4fc'
  },


});
