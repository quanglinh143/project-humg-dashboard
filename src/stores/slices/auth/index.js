import { createSlice } from "@reduxjs/toolkit"

const initialState = {
 token: 0,
 userInfo: {},
}

const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
  setToken: (state, action) => {
   state.token = action.payload
  },
  setUserInfo: (state, action) => {
   state.userInfo = action.payload
  },
 },
})

export const authReducer = authSlice.reducer

export const authActions = authSlice.actions
