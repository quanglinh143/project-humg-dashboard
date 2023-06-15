import React, { useCallback, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { sidebarActions } from "stores/slices/sidebar"
import { Popover, Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { selectActiveSidebar } from "stores/slices/sidebar/selectors"
import { selectUserInfo, selectToken } from "stores/slices/auth/selectors"
import { useGetWidth } from "hooks/useGetWidth"
import { authActions } from "stores/slices/auth"
import { getUserApi } from "services/api-client/user"
import classes from "./Header.module.scss"
import { useDataMenu } from "hooks/useDataMenu"
import { CloseIcon } from "icons"
import { SidebarIcon } from "icons"

const Header = () => {
 const { dataMenuProfile } = useDataMenu()
 const dispatch = useDispatch()
 const activeSidebar = useSelector(selectActiveSidebar)
 const userInfo = useSelector(selectUserInfo)
 const token = useSelector(selectToken)
 const width = useGetWidth()

 const authToken = localStorage.getItem("authToken")

 const fetchProfileData = async () => {
  try {
   const response = await getUserApi(authToken)
   if (response.status === 200) {
    dispatch(authActions.setUserInfo(response.data))
   }
  } catch (error) {
   console.log(error.msg)
  }
 }

 useEffect(() => {
  if (token) {
   fetchProfileData()
  }
 }, [token])

 const handleActiveSidebar = useCallback(() => {
  dispatch(sidebarActions.setActiveSidebar(!activeSidebar))
 }, [activeSidebar])

 const handleUnOverlay = useCallback(() => {
  dispatch(sidebarActions.setActiveSidebar(!activeSidebar))
 }, [activeSidebar])
 const menuItem = () => {
  return (
   <div className={classes.popOverHeadMenu}>
    <div className={classes.headInfo}>
     <div className={classes.headInfo_img}>
      <img
       src={userInfo?.avatar?.url}
       alt={userInfo?.avatar?.url}
       className={classes.headInfo_img}
      />
     </div>
     <div className={classes.headInfo_person}>
      <div className={classes.headInfo_person_name}>{userInfo?.name}</div>
      <div className={classes.headInfo_person_position}>administrators</div>
     </div>
    </div>
    {dataMenuProfile.map((item, index) => {
     return (
      <div className={classes.box} onClick={item.callback} key={index}>
       <div className={classes.icon}>{item.icon}</div>
       <div className={classes.text}>{item.label}</div>
      </div>
     )
    })}
   </div>
  )
 }

 const loggedRouter = () => {
  return (
   <div className={classes.person}>
    <Popover content={menuItem} trigger="click">
     {userInfo && userInfo.avatar ? (
      <img
       src={userInfo.avatar.url}
       alt={userInfo.avatar.url}
       className={classes.avatarHeader}
      />
     ) : (
      <Avatar size={32} icon={<UserOutlined />} />
     )}
    </Popover>
   </div>
  )
 }

 return (
  <div className={classes.container}>
   <div
    onClick={handleActiveSidebar}
    className={
     width <= 1000 ? classes.iconSidebarActive : classes.iconSidebarHidden
    }
   >
    {activeSidebar ? (
     <CloseIcon className={classes.icon} />
    ) : (
     <SidebarIcon className={classes.icon} />
    )}
   </div>
   <img src="/images/logoChamm.png" alt="" className={classes.imgLogo} />
   {loggedRouter()}
   {/* <div
    className={activeSidebar ? classes.overlay : classes.unOverlay}
    onClick={handleUnOverlay}
   /> */}
  </div>
 )
}

export default Header
