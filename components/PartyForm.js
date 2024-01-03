import React, { useEffect, useRef, useState } from 'react'
import { TouchableOpacity } from 'react-native';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addStudent, resetStudents } from '../reducers/temp_order';
import uuid from 'react-native-uuid';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decreaseBag, initializeBags, loadBill } from '../reducers/bill';
import { getPrintBill } from './services/PrintService';
import * as Print from 'expo-print';

export const PartyForm = (props) => {
  const username = useSelector(state => state.auth.username)
  const bill = useSelector(state => state.bill.bill);
  const totalBags=useSelector(state=>state.bill.bags)
  const students = useSelector(state => state.tempOrder.students);
  const dispatch = useDispatch()
  const uuidValue = uuid.v4();
  const rowId = parseInt(uuidValue.substring(0, 4), 16);
  const quantityInputRef = useRef(null);
  const [partyformData, setpartyFormData] = useState({
    partyname: '',
    rate: '',
    quantity: '',
    username: username,
    agrnumber: '',
    serialnumber: '',
  });
  const handleChange = (field, value) => {
    setpartyFormData({
      ...partyformData,
      [field]: value,
    });
  };
  async function loadStoredBill() {
    try {
      const billData = await AsyncStorage.getItem('bill');
      if (billData) {
        dispatch(loadBill(JSON.parse(billData)));
      }
    } catch (error) {
      console.log(error.response.data.message)
    }
  }

  useEffect(() => {
    loadStoredBill();
  }, []);
  useEffect(() => {
    setpartyFormData((prevData) => ({
      ...prevData,
      agrnumber: bill[0]?.agrnumber || '',
      serialnumber: bill[0]?.serialnumber || '',

    }));
  }, [partyformData.partyname]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (totalBags > 0) {
      console.log(parseInt(bill[0]?.bags))
      if (partyformData.partyname && partyformData.rate && partyformData.quantity) {
        partyformData['rowid'] = rowId
        partyformData['agrnumber'] = bill[0] ? bill[0].agrnumber : ''
        partyformData['serialnumber'] = bill[0] ? bill[0].serialnumber : ''
        if (!partyformData.agrnumber) {
          alert('Please input the AGR Number.');
          return; // Exit the function if AGR number is blank
        }

        dispatch(addStudent(partyformData));
        setpartyFormData(prevData => ({
          ...prevData,
          quantity: ''
        }));
        quantityInputRef.current.focus();

        alert('your data is sent to list')
        dispatch(decreaseBag())
      } else {
        alert("Please fill all the field")
      }
    } else {
      alert("Total Bags are zero")
    }
  }
  const handleSaveData = async () => {
    if (students.length > 0) {
      //console.log(students)
      const headers = {
        Accept: 'application/json',
      };

      try {
        const response = await axios.post('https://skybillserver.vercel.app/create-party', students, { headers }
        );
        const { data } = response;
        const { success, message } = data;
        if (success) {
          dispatch(resetStudents())
          AsyncStorage.removeItem('students');
          setpartyFormData({
            partyname: '',
            rate: '',
            quantity: ''
          });
          alert("Your form data is saved")
        }
      } catch (error) {
        console.log(error.response.data.message)
        alert("Try again later")

      }
    } else {
      alert("Your Party Quantity Details is Empty")
    }
  }

  const generateHTMLContent = (data) => {
    // Initialize htmlContent outside the loop
    let htmlContent = '';
    const organizedData = data.reduce((acc, entry) => {
      const { partyname, quantity, rate, agrnumber, farmername, totalbags } = entry;
      const existingEntry = acc.find((item) => item.partyname === partyname);
      if (existingEntry) {
        existingEntry.quantity.push(quantity);
        existingEntry.totalquantity += parseInt(quantity, 10); // Update totalquantity
      } else {
        acc.push({
          partyname,
          quantity: [quantity],
          totalquantity: parseInt(quantity, 10),
          rate,
        });
      }

      return acc;
    }, []);
    // Calculate remaining quantity
    const totalBags = parseInt(data[0].totalbags, 10);
    const totalQuantitySum = organizedData.reduce((sum, entry) => sum + entry.totalquantity, 0);
    const totalQuantityLength = organizedData.reduce((total, entry) => {
      return total + entry.quantity.length;
    }, 0);
    const remainingQuantity = totalBags - totalQuantityLength
    // Get current date and time
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;

    // Add current date and time in the first line
    htmlContent += `
    <div style="display: flex; justify-content: space-between;font-size:48px;">
      <div style="display: flex; justify-content: space-between;"><p>Date</p> <p>${formattedDate}</p></div>
      <div style="display: flex; justify-content: space-between;"><p>Time</p> <p>${formattedTime}</p></div>
    </div>
  `;

    // Add agrnumber, farmername, and totalbags
    htmlContent += `
    <div style="font-size:48px;">
         <div style="display: flex; justify-content: space-between;"><p>AGR Number</p> <p>${data[0].agrnumber}</p></div>
         <div style="display: flex; justify-content: space-between;"><p>Farmer Name</p> <p>${data[0].farmername}</p></div>
         <div style="display: flex; justify-content: space-between;"><p>Total Bags</p> <p>${data[0].totalbags}</p></div>
         <div style="border-bottom: 1px solid black;"></div>
         <div style="border-bottom: 1px solid black;"></div>

    </div>
  `;

    // Use forEach instead of map, and append to htmlContent directly
    organizedData.forEach((entry, index) => {
      htmlContent += `
      <div style="margin-bottom: 2px;font-size:48px;border-bottom: 1px solid black;">
      <div style="display: flex; justify-content: space-between;"><p>Party Name :</p> <p>${entry.partyname}</p></div>
      <div style="display: flex; justify-content: space-between;"><p>Rate :</p> <p>${entry.rate}</p></div>
      <div style="display: flex; flex-wrap: wrap;">
      <p style="margin-right: 1px;">Quantity:</p>
      ${entry.quantity.map((qty, index) => (
        `<p style="margin-left: 70px;">${qty}</p>${(index + 1) % 4 === 0 ? '<br />' : ''}`

      )).join('')}
    </div>
          <div style="display: flex; justify-content: space-between;font-size:48px;"><p>Total :</p> <p>${entry.totalquantity}</p></div>
      </div>`;
    });

    // Add remaining quantity
    htmlContent += `
    <div style="font-size:48px;">
    <div style="display: flex; justify-content: space-between;"><p>Total</p> <p>${totalQuantitySum}</p></div>
      <div style="display: flex; justify-content: space-between;"><p>Remaining Quantity</p> <p>${remainingQuantity}</p></div>
    </div>
  `;

    return htmlContent;
  };


  const handlePrint = async () => {
    try {
      if (bill[0]?.agrnumber) {
        const printBillData = await getPrintBill(bill[0]?.agrnumber)
        const htmlContent = generateHTMLContent(printBillData);
        // console.log('Generated HTML:', htmlContent);
        await Print.printAsync({ html: htmlContent });

      } else {
        alert("Please, Input AGRNumber")
      }

    } catch (error) {
      console.log('Error printing:', error.response.data.message);
    }
  };

  return (
    <View>
      <ScrollView contentContainerStyle={PartyFormStyles.container}>
        {/* <Text style={PartyFormStyles.heading}>Party Form</Text> */}
        <View style={PartyFormStyles.codeContainer}>
          <Text style={{ flex: 1, fontWeight: "500", color: "red" }}>Total Bags : {totalBags}</Text>
        </View>

        <TextInput
          style={PartyFormStyles.input}
          placeholder="Party Name"
          onChangeText={(text) => handleChange('partyname', text)}
          value={partyformData.partyname}
        />
        <TextInput
          style={PartyFormStyles.input}
          placeholder="Rate"
          onChangeText={(text) => handleChange('rate', text)}
          value={partyformData.rate}
        />
        <TextInput
          style={PartyFormStyles.input}
          ref={quantityInputRef}
          placeholder="Quantity"
          onChangeText={(text) => handleChange('quantity', text)}
          value={partyformData.quantity}
          onKeyPress={handleKeyPress}
        />
        <View style={PartyFormStyles.buttonContainer}>
          <TouchableOpacity style={PartyFormStyles.button} onPress={handleSubmit}>
            <Text style={PartyFormStyles.buttonText}>Add</Text>
          </TouchableOpacity>
          <TouchableOpacity style={PartyFormStyles.button} onPress={handleSaveData} >
            <Text style={PartyFormStyles.buttonText}>New Party</Text>
          </TouchableOpacity>
          <TouchableOpacity style={PartyFormStyles.button} onPress={handlePrint} >
            <Text style={PartyFormStyles.buttonText}>Print</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const PartyFormStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 5,
    paddingTop: 10,

  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 2,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
    backgroundColor: "#EAFAF1",
    fontWeight: "500"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: '#145A32',
    padding: 10,
    borderRadius: 5,
    marginTop: 1,
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: "500"
  },
});

