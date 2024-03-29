import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Alert, StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Login = () => {
  //  const inputRef=useRef()
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const getName = async () => {
        const username = await AsyncStorage.getItem('auth');
        return username;
    }
    
    useEffect(() => {
        const checkAndNavigate = async () => {
            const username = await getName();
            if (username) {
                navigation.navigate('Home');
            }
        };
    
        checkAndNavigate();
    }, []);
    
    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };


    const handleSubmit = async () => {
        //alert("hi login")
        //inputRef.current.focus()
        if (formData.username && formData.password) {
            try {
                const headers = {
                    Accept: 'application/json',
                };    
                const response = await axios.post('https://skybillserver.vercel.app/login', formData, { headers });
                const { data } = response;
                const { success, message, token, username } = data;
                if (success) {
                    dispatch(login(username))
                    setFormData({
                        username: '',
                        password: '',
                    });

                    navigation.navigate('Home');
                    //alert('Success', 'You are logged in successfully');

                } else {
                    alert('Error', message || 'Login failed');
                }
            } catch (error) {
                console.log(error.response.data.message)
                alert("Invalid UserName and Password")
            }
        } else {
            alert("Please Fill UserName and Password")
        }
    }

    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         handleSubmit()
    //     }
    // }
    return (
        <ScrollView contentContainerStyle={LoginStyles.container}>
            <TextInput
               // ref={inputRef}
                style={LoginStyles.input}
                placeholder="UserName"
                onChangeText={(text) => handleChange('username', text)}
                value={formData.username}
            />
            <TextInput
                style={LoginStyles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => handleChange('password', text)}
                value={formData.password}
                // onKeyPress={handleKeyPress}
                onSubmitEditing={() => {
                    handleSubmit(); // For Android
                }}

            />
            <View style={LoginStyles.buttonContainer}>
                <TouchableOpacity style={LoginStyles.button} onPress={handleSubmit}>
                    <Text style={LoginStyles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const LoginStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#17202A',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 1,
        paddingBottom: 1,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        backgroundColor: "#D5F5E3",
        borderWidth: 2,
        marginBottom: 10,
        paddingLeft: 10,
        width: '100%',
        fontWeight: "500",
        borderRadius: 5,

    },
    buttonContainer: {
        flexDirection: "row",
        width: '100%',
    },
    button: {
        backgroundColor: '#145A32',
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


