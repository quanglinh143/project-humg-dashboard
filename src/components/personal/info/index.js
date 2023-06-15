import React, { useCallback, useLayoutEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { selectUserInfo } from "stores/slices/auth/selectors"
import { DatePicker, Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"
import Loading from "utils/Loading"
import moment from "moment"
import classes from "./InfoPerson.module.scss"
import { openNotification } from "atomics/Notification"
import { selectToken } from "stores/slices/auth/selectors"
import { updateUserInfoApi } from "services/api-client/profile"
import { authActions } from "stores/slices/auth"
import { getUserApi } from "services/api-client/user"
import { uploadImg } from "services/api-client/uploadImg"

const initialState = {
 name: "",
 avatar: "",
 phone_number: "",
 date_of_birth: "",
 address: "",
 gender: "",
}
const InfoPerson = () => {
 const dispatch = useDispatch()
 const userInfo = useSelector(selectUserInfo)
 const token = useSelector(selectToken)
 const [updateUserInfo, setUpdateUserInfo] = useState({
  id: userInfo?._id,
  name: userInfo?.name,
  avatar: userInfo?.avatar,
  phone_number: userInfo?.phone_number,
  date_of_birth: userInfo?.date_of_birth,
  address: userInfo?.address,
  gender: userInfo?.gender,
 })
 const [updateInfo, setUpdateInfo] = useState(false)
 const [loading, setLoading] = useState(false)

 useLayoutEffect(() => {
  setUpdateUserInfo({
   id: userInfo?._id,
   name: userInfo?.name,
   avatar: userInfo?.avatar,
   phone_number: userInfo?.phone_number,
   date_of_birth: userInfo?.date_of_birth,
   address: userInfo?.address,
   gender: userInfo?.gender,
  })
 }, [userInfo])
 const authToken = localStorage.getItem("authToken")
 const fetchProfileData = async () => {
  setLoading(true)
  try {
   const response = await getUserApi(authToken)
   if (response.status === 200) {
    dispatch(authActions.setUserInfo(response.data))
   }
  } catch (error) {
   console.log(error)
  }
  setLoading(false)
 }

 const handleSubmit = async (event) => {
  event.preventDefault()
  try {
   const res = await updateUserInfoApi(
    { ...updateUserInfo, id: userInfo?._id },
    {
     headers: { Authorization: token },
    }
   )
   if (res.status === 200) {
    fetchProfileData()
    openNotification("success", "updated successfully!")
   }
  } catch (error) {
   openNotification("error", error.msg)
  }
  setUpdateInfo(false)
 }

 const handleCancelUpdate = useCallback(() => {
  setUpdateInfo(false)
  setUpdateUserInfo({
   id: userInfo?._id,
   name: userInfo?.name,
   avatar: userInfo?.avatar,
   phone_number: userInfo?.phone_number,
   date_of_birth: userInfo?.date_of_birth,
   address: userInfo?.address,
   gender: userInfo?.gender,
  })
 }, [updateInfo])
 const handleChangeInfo = (event) => {
  const { name, value } = event.target

  setUpdateUserInfo({
   ...updateUserInfo,
   [name]: value,
   avatar: updateUserInfo.avatar,
  })
 }

 function onChangeBirth(date, dateString) {
  setUpdateUserInfo({ ...initialState, date_of_birth: dateString })
 }

 const handleUploadImg = async (event) => {
  event.persist()
  try {
   const file = event.target.files[0]
   if (!file) openNotification("warning", "Dữ không tồn tại.")
   if (file.size > 1024 * 1024) openNotification("warning", "Dữ liệu quá lớn.")
   if (
    file.type !== "image/jpeg" &&
    file.type !== "image/png" &&
    file.type !== "image/jpg"
   )
    openNotification("warning", "Dữ liệu không đúng!")

   setLoading(true)
   const res = await uploadImg(file, token)
   if (res.status === 200) {
    event.target.value = null
   }
   setUpdateUserInfo({ ...updateUserInfo, avatar: res.data })
  } catch (error) {
   setLoading(false)
   openNotification("error", "Đã có lỗi xảy ra")
  }
  setLoading(false)
 }
 console.log("userInfo", userInfo)
 return (
  <div className={classes.container}>
   <form className={classes.form} onSubmit={handleSubmit}>
    <div className={classes.personal}>
     <div className={classes.box}>
      <div className={classes.boxItem}>
       <div className={classes.title}>Tên người dùng:</div>
       <div className={classes.content}>{userInfo?.name}</div>
       {updateInfo && (
        <input
         name="name"
         value={updateUserInfo.name}
         onChange={handleChangeInfo}
         className={classes.input}
        />
       )}
      </div>
     </div>

     <div className={classes.box}>
      <div className={classes.boxItem}>
       <div className={classes.title}>Email:</div>
       email
       {userInfo?.email && (
        <div className={classes.content}>
         {userInfo?.email}{" "}
         <span className={classes.activatedEmail}>(Activated)</span>
        </div>
       )}
      </div>
     </div>

     <div className={classes.box}>
      <div className={classes.boxItem}>
       <div className={classes.title}>Số điện thoại:</div>
       <div className={classes.content}>{userInfo?.phone_number}</div>
       {updateInfo && (
        <input
         name="phone_number"
         value={updateUserInfo.phone_number}
         onChange={handleChangeInfo}
         className={classes.input}
        />
       )}
      </div>
     </div>

     <div className={classes.box}>
      <div className={classes.boxItem}>
       <div className={classes.title}>Ngày sinh:</div>
       <div className={classes.content}>
        {updateUserInfo.date_of_birth
         ? moment(updateUserInfo?.date_of_birth).format("DD/MM/YYYY")
         : "Add your date of birth"}
       </div>
       {updateInfo && (
        <DatePicker
         name="gender"
         className={classes.input}
         onChange={(date, dateString) => onChangeBirth(date, dateString)}
        />
       )}
      </div>
     </div>

     <div className={classes.box}>
      <div className={classes.boxItem}>
       <div className={classes.title}>Giới tính:</div>
       <div className={classes.content}>
        {userInfo?.gender === "0" && "Nam"}
        {userInfo?.gender === "1" && "Nữ"}
        {userInfo?.gender === "2" && "Khác"}
       </div>
       {updateInfo && (
        <select
         className={classes.selectGender}
         name="gender"
         value={updateUserInfo.gender}
         onChange={handleChangeInfo}
        >
         <option value="0">Nam</option>
         <option value="1">Nữ</option>
         <option value="2">Khác</option>
        </select>
       )}
      </div>
     </div>

     <div className={classes.box}>
      <div className={classes.boxItem}>
       <div className={classes.title}>Địa chỉ:</div>
       <div className={classes.content}>
        {userInfo.address ? userInfo.address : "Thêm địa chỉ"}
       </div>
       {updateInfo && (
        <input
         value={updateUserInfo.address}
         name="address"
         onChange={handleChangeInfo}
         className={classes.input}
        />
       )}
      </div>
     </div>
    </div>

    <div className={classes.rightInfo}>
     <div className={classes.avatar}>
      <div className={classes.avatarBox}>
       <input
        type="file"
        id="uploadImg"
        onChange={handleUploadImg}
        className={classes.uploadImg}
       />
       <div className={classes.avatar_img}>
        {updateUserInfo && updateUserInfo.avatar ? (
         loading ? (
          <Loading />
         ) : (
          <img
           src={updateUserInfo.avatar.url}
           alt={updateUserInfo.avatar.url}
           className={classes.avatarHeader}
          />
         )
        ) : (
         <Avatar size={82} icon={<UserOutlined />} />
        )}
       </div>

       {updateInfo && (
        <label className={classes.avatar_upload} htmlFor="uploadImg">
         Chọn ảnh
        </label>
       )}
      </div>
     </div>
     {updateInfo ? (
      <div className={classes.updateInfoBtn}>
       <div
        className={classes.updateInfoBtn_cancel}
        onClick={handleCancelUpdate}
       >
        Hủy
       </div>
       <button
        type="submit"
        className={classes.updateInfoBtn_submit}
        disabled={loading}
       >
        Cập nhật
       </button>
      </div>
     ) : (
      <div className={classes.updateBtn} onClick={() => setUpdateInfo(true)}>
       Cập nhật thông tin
      </div>
     )}
    </div>
   </form>
  </div>
 )
}

export default InfoPerson
