import axios from "axios"

const BASE_URL = 'https://skybillserver.vercel.app'
//const BASE_URL = 'http://172.24.0.168:5000'

export const getPrintBill = async (agrnumber) => {
  try {
    const response = await axios.get(`${BASE_URL}/get-billdetails/${agrnumber}`);
    return response.data.data
  } catch (e) {
    console.log(e.response.data.message)
  }
}

