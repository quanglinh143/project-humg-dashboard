import { createSlice } from "@reduxjs/toolkit"

const initialState = {
 activeSidebar: false,
}

const sidebarSlice = createSlice({
 name: "sidebar",
 initialState,
 reducers: {
  setActiveSidebar: (state, action) => {
   state.activeSidebar = action.payload
  },
 },
})

export const sidebarReducer = sidebarSlice.reducer

export const sidebarActions = sidebarSlice.actions
