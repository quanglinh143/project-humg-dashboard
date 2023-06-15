import { createSlice } from "@reduxjs/toolkit"

const initialState = {
 value: 0,
}

const countSlice = createSlice({
 name: "count",
 initialState,
 reducers: {
  increment: (state, action) => {
   state.value += action.payload
  },
 },
})

export const countReducer = countSlice.reducer

export const countActions = countSlice.actions
