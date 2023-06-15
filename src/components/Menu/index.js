import React, { useCallback, useEffect } from "react"
import Header from "../Header"
import SideMenu from "../SideMenu"
import ContentMenu from "../ContentMenu"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { authActions } from "stores/slices/auth"
import { refreshTokenApi } from "services/api-client/auth"
import classes from "./Menu.module.scss"
import { selectActiveSidebar } from "stores/slices/sidebar/selectors"
import { sidebarActions } from "stores/slices/sidebar"

const Menu = ({ children }) => {
 const navigate = useNavigate()
 const activeSidebar = useSelector(selectActiveSidebar)
 const dispatch = useDispatch()
 const login = localStorage.getItem("login")
 const authToken = localStorage.getItem("authToken")
 useEffect(() => {
  if (login) {
   const refreshToken = async () => {
    try {
     const token = await refreshTokenApi()
     if (token.status === 200) {
      dispatch(authActions.setToken(token.data.accesstoken))
      localStorage.setItem("authToken", token.data.accesstoken)
     }
     setTimeout(() => {
      refreshToken()
     }, 30 * 60 * 1000)
    } catch (error) {
     if (error.msg === "Please Login or Register") {
      localStorage.removeItem("login")
      localStorage.removeItem("admin")
      localStorage.removeItem("authToken")
      dispatch(authActions.setToken(""))
      navigate("/login")
     }
     console.log("error token", error || "error token")
    }
   }
   refreshToken()
  }
 }, [login, authToken])

 const handleUnOverlay = useCallback(() => {
  dispatch(sidebarActions.setActiveSidebar(!activeSidebar))
 }, [activeSidebar])

 return (
  <div>
   <Header />
   <div className={classes.content}>
    <SideMenu />
    <ContentMenu>{children}</ContentMenu>
   </div>
   <div
    className={activeSidebar ? classes.overlay : classes.unOverlay}
    onClick={handleUnOverlay}
   />
  </div>
 )
}

export default Menu
