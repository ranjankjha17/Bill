import React, { useEffect } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { PartyFormList } from '../components/PartyFormList';
import { PartyForm } from '../components/PartyForm';
import { Home } from './Home';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { resetBill } from '../reducers/bill';
import { resetStudents } from '../reducers/temp_order';
import { AdminDashboard } from './AdminDashboard';
import { Main } from './Main';
import { Logout } from '../components/Logout';

export const Dashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const username = useSelector(state => state.auth.username)

  useEffect(() => {
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

