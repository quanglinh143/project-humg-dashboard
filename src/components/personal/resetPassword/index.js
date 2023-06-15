import React, { useState } from "react"
import { selectToken } from "stores/slices/auth/selectors"

import classes from "./ResetPassword.module.scss"
import { useSelector } from "react-redux"
import { selectUserInfo } from "stores/slices/auth/selectors"
import { resetPasswordApi } from "services/api-client/user"
import { openNotification } from "atomics/Notification"
import { useNavigate } from "react-router-dom"
import { Input } from "antd"
const initialState = {
 oldPassword: "",
 password: "",
 rePassword: "",
}

const ResetPassword = () => {
 const token = useSelector(selectToken)
 const userInfo = useSelector(selectUserInfo)
 const [newPassword, setNewPassword] = useState(initialState)

 const handleResetPassword = async (event) => {
  event.preventDefault()
  try {
   const res = await resetPasswordApi({
    token: token,
    id: userInfo?._id,
    newPassword: newPassword,
   })
   if (res.status === 200) {
    window.location.href = "/"
    openNotification("success", "Cập nhật thành công")
   }
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }

 const handleOnchangePassword = (event) => {
  const { name, value } = event.target
  setNewPassword({ ...newPassword, [name]: value })
 }

 return (
  <div className={classes.container}>
   <div className={classes.formReset}>
    <form className={classes.form} onSubmit={handleResetPassword}>
     <div className={classes.title}>Đổi mật khẩu</div>
     <div>
      <div className={classes.text}>Mật khẩu hiện tại:</div>
      <Input.Password
       name="oldPassword"
       className={classes.input}
       onChange={handleOnchangePassword}
       type="password"
      />
     </div>
     <div>
      <div className={classes.text}>Mật khẩu mới:</div>
      <Input.Password
       name="password"
       className={classes.input}
       onChange={handleOnchangePassword}
       type="password"
      />
     </div>
     <div>
      <div className={classes.text}>Nhập lại mật khẩu mới:</div>
      <Input.Password
       name="rePassword"
       className={classes.input}
       onChange={handleOnchangePassword}
       type="password"
      />
     </div>
     <div className={classes.updateBtn}>
      <button className={classes.updateBtn_cancel}>Hủy</button>
      <button className={classes.updateBtn_submit} type="submit">
       Cập nhật
      </button>
     </div>
    </form>
   </div>
  </div>
 )
}

export default ResetPassword
