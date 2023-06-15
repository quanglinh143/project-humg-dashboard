import React, { useEffect } from "react"
import { Tabs } from "antd"
import Policy from "./policy"
import InfoPerson from "./info"
import ResetPassword from "./resetPassword"
import { useNavigate } from "react-router-dom"
import classes from "./Personal.module.scss"

const Personal = () => {
 const navigate = useNavigate()
 const login = localStorage.getItem("login")
 useEffect(() => {
  if (!login) {
   navigate("/login")
  }
 }, [login])

 const items = [
  {
   key: "1",
   label: `Thông tin cá nhân`,
   children: <InfoPerson />,
  },
  {
   key: "2",
   label: `Đổi mật khẩu`,
   children: <ResetPassword />,
  },
  {
   key: "3",
   label: `Chính sách sử dụng`,
   children: <Policy />,
  },
 ]

 return (
  <div className={classes.container}>
   <div className={classes.update}>
    <h2>Cài đặt</h2>
    <Tabs defaultActiveKey="1" items={items} className={classes.tabs} />
   </div>
  </div>
 )
}

export default Personal
