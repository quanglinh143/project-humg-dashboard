import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button, Form, Input } from "antd"
import { loginApi } from "services/api-client/auth"
import { useNavigate } from "react-router-dom"
import classes from "./Login.module.scss"
import { openNotification } from "atomics/Notification"
import { getUserApi } from "services/api-client/user"
import { useDispatch } from "react-redux"
import { authActions } from "stores/slices/auth"

const Login = () => {
 const navigate = useNavigate()
 const dispatch = useDispatch()

 const handleFinish = async (values) => {
  const { email, password } = values
  try {
   const response = await loginApi({ email, password })
   if (response.status === 200) {
    const responseUserInfo = await getUserApi(response.data.accesstoken)
    if (responseUserInfo.status === 200) {
     localStorage.setItem("login", true)
     localStorage.setItem("admin", true)
     localStorage.setItem("authToken", responseUserInfo.data.accesstoken)
     dispatch(authActions.setUserInfo(null))
     dispatch(authActions.setToken(responseUserInfo.data.accesstoken))
    }
    navigate("/")
   }
  } catch (error) {
   console.log("error", error)
   openNotification("error", error.msg || "Đã có lỗi xảy ra!")
  }
 }

 const formLogin = () => {
  return (
   <div className={classes.formItem}>
    <h1 className={classes.title}>Đăng nhập</h1>
    <h4 className={classes.slogan}>Bạn đã sẵn sàng cho lễ hội mua sắm?</h4>
    <Form onFinish={handleFinish}>
     <Form.Item
      name="email"
      className={classes.formItem}
      rules={[
       {
        type: "email",
        message: "Vui lòng nhập định dạng email!",
       },
       {
        required: true,
        message: "Vui lòng nhập định dạng email!",
       },
      ]}
      normalize={(value) => value.trim()}
     >
      <div className={classes.boxInput}>
       <div className={classes.label}>Emaill</div>
       <Input placeholder="Vui lòng nhập định dạng email..." />
      </div>
     </Form.Item>
     <Form.Item
      name="password"
      className={classes.formItem}
      style={{ marginBottom: "14px" }}
      rules={[
       {
        required: true,
        message: "Vui lòng nhập mật khẩu",
       },
       {
        whitespace: false,
        message: "Please don't leave any spaces",
       },
      ]}
     >
      <div className={classes.boxInput}>
       <div className={classes.label}>Mật khẩu</div>
       <Input.Password placeholder="Vui lòng nhập mật khẩu..." />
      </div>
     </Form.Item>
     <div className={classes.row}>
      <Button type="primary" htmlType="submit" className={classes.loginBtn}>
       Đăng nhập
      </Button>
     </div>
    </Form>
   </div>
  )
 }

 return (
  <div className={classes.container}>
   <div className={classes.banner}>
    <img src="images/bannerLogin.jpg" />
   </div>
   <div className={classes.form}>{formLogin()}</div>
  </div>
 )
}

export default Login
