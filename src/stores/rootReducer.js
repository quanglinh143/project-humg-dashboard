import { combineReducers } from "@reduxjs/toolkit"
import { countReducer } from "stores/slices/count"
import { authReducer } from "stores/slices/auth"
import { sidebarReducer } from "stores/slices/sidebar"

const rootReducer = combineReducers({
 count: countReducer,
 auth: authReducer,
 sidebar: sidebarReducer,
})

export default rootReducer
