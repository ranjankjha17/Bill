import {ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../reducers/login';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetBill } from '../reducers/bill';
import { resetStudents } from '../reducers/temp_order';

export const Logout = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const username = useSelector(state => state.auth.username)
  
    const handlelogout = async () => {
        try {
          await AsyncStorage.removeItem('bill')
          dispatch(resetBill())
          dispatch(resetStudents())
          await AsyncStorage.removeItem('auth');
          dispatch(logout())
          navigation.navigate('Login');
        } catch (error) {
          console.log(error.response.data.message)
         // alert("Try again later")
    }
      };
    
  return (
    <View style={LogoutStyles.buttonContainer}>
    <TouchableOpacity style={LogoutStyles.button} onPress={handlelogout}>
      <Text style={LogoutStyles.buttonText}>Logout</Text>
    </TouchableOpacity>
  </View>
)
}

const LogoutStyles = StyleSheet.create({
  
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
  
  