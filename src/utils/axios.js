import axios from 'axios'
import { RAPID_API_KEY, RAPID_API_URL } from "../config";

export const apiRequest = async (options) => {
  try {
    return await axios.request(options)
  } catch (e) {
    return e.response
  }
}
export const apiGetRequest = async (url) => {
  try {
    return await axios.get(url)
  } catch (e) {
    return e.response
  }
}

export const apiPostRequest = async (url, payload) => {
  try {
    // return await axios.post(url, payload)
    return await axios({
      url: url,
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        
      },
    })
  } catch (e) {
    return e.response
  }
}

export const setupAxios = () => {
  axios.interceptors.request.use((config) => {
    config.headers['X-RapidAPI-Key'] = RAPID_API_KEY
    config.headers['X-RapidAPI-HOST'] = RAPID_API_URL

    return config
  }, (err) => Promise.reject(err))
}