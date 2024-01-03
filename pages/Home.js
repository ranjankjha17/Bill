import React, { useEffect, useMemo, useRef, useState } from 'react'
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addBill, initializeBags, loadBill, resetBags, resetBill } from '../reducers/bill';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { resetStudents } from '../reducers/temp_order';

export const Home = (props) => {
    const inputRef = useRef(null);
    //const { username } = props
    const username=useSelector(state=>state.auth.username)
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const bill = useSelector(state => state.bill.bill);
    async function loadStoredBill() {
        try {
            const billData = await AsyncStorage.getItem('bill');
            if (billData) {
                dispatch(loadBill(JSON.parse(billData)));
            }
        } catch (error) {
            console.log(error.response.data.message);
        }
    }
    const getCurrentDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const formatTime = (value) => {
        return value < 10 ? `0${value}` : `${value}`;
    };

    const getCurrentTime = () => {
        const currentTime = new Date();
        const hours = formatTime(currentTime.getHours());
        const minutes = formatTime(currentTime.getMinutes());
        const seconds = formatTime(currentTime.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    };
    const getSerialNumber = async () => {
        try {
            const { data } = await axios.get('https://skybillserver.vercel.app/get-serialnumber')
            const serialnumber = await data.data
            setFormData((prevData) => ({
                ...prevData,
                serialnumber,
            }));
        } catch (error) {
            console.log(error.response.data.message)
        }
    }

    const [formData, setFormData] = useState({
        serialnumber: '',
        agrnumber: '',
        farmername: '',
        bags: '',
        date: getCurrentDate(),
        time: getCurrentTime(),
        username: username,
    });
    const handleChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          //handleSubmit();
          alert("Hi enter")
        }
      };
    
    const handleSubmit = async () => {
        if (formData.agrnumber && formData.farmername && formData.bags) {
            const headers = {
                Accept: 'application/json',
            };
            try {
                const response = await axios.post('https://skybillserver.vercel.app/create-bill', formData, { headers }
                );
                const { data } = response;
                const { success, message } = data;

                if (success) {
                    dispatch(addBill(formData))
                    // setFormData({
                    //     farmername: '',
                    //     bags: '',
                    //     agrnumber: ''
                    // });
                    dispatch(initializeBags(formData.bags));
                    alert("Your form data is saved")

                }
            } catch (error) {
                console.log(error.response.data.message)
                alert("Try again later")
            }
        } else {
            alert("Please fill all the field")
        }
    }
    // useEffect(() => {

    // }, [username])

    useEffect(() => {
        loadStoredBill();
        getSerialNumber()
        const intervalId = setInterval(() => {
            setFormData((prevData) => ({
                ...prevData,
                time: getCurrentTime(),
                date: getCurrentDate(),
            }));
        }, 1000);

        return () => clearInterval(intervalId);
    }, [formData.serialnumber]);

    const handleNewBill = async () => {
        try {
            await AsyncStorage.removeItem('bill');
            dispatch(resetBill())
            dispatch(resetStudents())
            dispatch(resetBags())
            setFormData({
                farmername: '',
                bags: '',
                agrnumber: ''
            });
            alert("Create a New Bill")
           // navigation.navigate('Home');
        } catch (error) {
            console.log(error.response.data.message)
            alert("Try Again")
        }
    };
    return (
        <View>
            <ScrollView contentContainerStyle={HomeStyles.container}>
                <View style={HomeStyles.headingContainer}>
                    <Text style={{ ...HomeStyles.heading, flex: 1 }}>Form</Text>
                    <View style={{ ...HomeStyles.buttonContainer, flex: 1 }}>
                        <TouchableOpacity style={HomeStyles.button} onPress={handleNewBill} >
                            <Text style={HomeStyles.buttonText}>New Bill</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={HomeStyles.codeContainer}>
                    <Text style={{ flex: 1, fontWeight: "500" }}>DATE : {formData.date}</Text>
                    <Text style={{ flex: 1, fontWeight: "500" }}>TIME : {formData.time}</Text>
                </View>
                <View style={HomeStyles.codeContainer}>
                    <Text style={{ flex: 1, fontWeight: "500" }}>Serial Number : {formData.serialnumber}</Text>
                </View>
                <TextInput
                    style={HomeStyles.input}
                    placeholder="AGR Number"
                    onChangeText={(text) => handleChange('agrnumber', text)}
                    value={formData.agrnumber}
                />
                <TextInput
                    style={HomeStyles.input}
                    placeholder="Farmer Name"
                    onChangeText={(text) => handleChange('farmername', text)}
                    value={formData.farmername}
                />
                <TextInput
                    style={HomeStyles.input}
                    placeholder="Bags"
                    onChangeText={(text) => handleChange('bags', text)}
                    value={formData.bags}
                    ref={inputRef}
                    onKeyPress={handleKeyPress}
                />
                <View style={HomeStyles.buttonContainer}>
                    <TouchableOpacity style={HomeStyles.button} onPress={handleSubmit}>
                        <Text style={HomeStyles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const HomeStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 1,
        paddingBottom: 1,
    },
    heading: {
        fontSize: 18,
        marginBottom: 20,
        color: '#1C2833',
        fontWeight: '700',
    },

    input: {
        height: 40,
        borderColor: 'gray',
        backgroundColor: "#D5F5E3",
        borderWidth: 2,
        marginBottom: 10,
        paddingLeft: 10,
        width: '100%',
        fontWeight: "500"
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 5,
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

    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    }

});

