import React, { useEffect } from 'react'
import { ScrollView, StyleSheet} from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AdminDashboard } from './AdminDashboard';
import { Main } from './Main';

export const Dashboard = () => {
  const navigation = useNavigation();
  const username = useSelector(state => state.auth.username)
  const getName = async () => {
    const username = await AsyncStorage.getItem('auth')
    return username
}
useEffect(() => {
    const username=getName()
    if(!username){    
      navigation.navigate('Login');
    }
}, [username])
  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      {
        username === 'admin'
          ?
            <AdminDashboard />
          :
          <>
          <Main/>
          </>
      }
    </ScrollView>
  )
}
const DashboardStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f0f0f0',
  },

  buttonContainer: {
    paddingLeft: 10,
    flexDirection: "row",
    width: '30%',
  },
  button: {
    backgroundColor: '#BFC9CA',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: "500"
  },
});

