import Axios from "axios"
import { developmentServer } from "constants/apiUrl.js"
const Instance = Axios.create({
 timeout: 20000,
 baseURL: developmentServer.baseUrl,
 withCredentials: true,
 headers: {
  Accept: "application/json",
  "Content-Type": "application/json",
 },
})

Instance.interceptors.request.use(
 (config) => {
  const token = localStorage.getItem("token")
  if (token) {
   // eslint-disable-next-line no-param-reassign
   config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
   }
  }
  return config
 },
 (err) => Promise.reject(err)
)

Instance.interceptors.response.use(
 (response) => {
  if (response.status === 401) {
   // add your code
   window.replace("/login")
  }
  return response
 },
 (error) => {
  if (error?.response?.status === 401 && localStorage.getItem("token")) {
   localStorage.removeItem("token")
   localStorage.removeItem("admin")
   localStorage.removeItem("userId")
   // window.location.reload()
   window.replace("/login")
  }
  if (error?.response && error?.response?.data) {
   // add your code
   return Promise.reject(error?.response?.data)
  }
  return Promise.reject(error?.message)
 }
)

export default Instance
