import React, { useState } from "react"
import classes from "./CreateCoupon.module.scss"
import { Button, DatePicker, Form, Input, Switch } from "antd"
import { openNotification } from "atomics/Notification"
import { createCouponApi } from "services/api-client/coupon"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import moment from "moment"

const initialState = {
 coupon_name: "",
 coupon_code: "",
 start_date: null,
 end_date: null,
 limits: 0,
 discounts: 0,
 status: true,
}

const CreateCoupon = () => {
 const token = useSelector(selectToken)
 const [checked, setChecked] = useState(true)
 const [couponInfo, setCouponInfo] = useState(initialState)
 const handleGotoCouponList = () => {
  window.location.href = "/coupon/coupon_list"
 }
 console.log("couponInfo =>>>", couponInfo)
 const onChangeActiveCoupon = (checked) => {
  setChecked(checked)
  setCouponInfo({ ...couponInfo, status: checked })
 }

 const handleOnchangeInfoCoupon = (event) => {
  const { name, value } = event.target
  setCouponInfo({ ...couponInfo, [name]: value })
 }

 function onChangeStartDate(_, dateString) {
  setCouponInfo({ ...couponInfo, start_date: dateString })
 }
 function onChangeEndDate(_, dateString) {
  setCouponInfo({ ...couponInfo, end_date: dateString })
 }

 const handleCreateFormCouponInfo = async (event) => {
  event.preventDefault()
  if (token) {
   try {
    const response = await createCouponApi(couponInfo, {
     headers: { Authorization: token },
    })
    if (response.status === 200) {
     console.log("response coupon =>>>", response)
     setCouponInfo(initialState)
     openNotification(
      "success",
      response.data.msg || "Thêm mới mã giảm giá thành công"
     )
    }
   } catch (error) {
    openNotification("error", error.msg || "Đã có lỗi xảy ra")
   }
  }
 }

 console.log("CouponInfo =>>>", couponInfo)
 return (
  <div className={classes.container}>
   <div className={classes.coupon}>
    <div className={classes.create}>
     <div className={classes.title}>
      <div className={classes.title_text}>Thêm mới mã khuyến mại</div>
      <div className={classes.couponList} onClick={handleGotoCouponList}>
       Đi đến danh sách khuyến mại
      </div>
     </div>
    </div>
    <form onSubmit={handleCreateFormCouponInfo}>
     <div className={classes.actions}>
      <div className={classes.checked}>
       <Switch
        defaultChecked
        onChange={onChangeActiveCoupon}
        className={checked ? classes.checked_switch : ""}
       />
       <span className={classes.checked_text}>
        {checked ? "Active" : "Inactive"}
       </span>
      </div>
      <div>
       <button className={classes.addNew} type="submit">
        Thêm mới
       </button>
      </div>
     </div>
     <div className={classes.endline} />
     <div className={classes.input}>
      <div className={classes.input_title}>Tên sự kiện</div>
      <input
       name="coupon_name"
       value={couponInfo.coupon_name}
       className={classes.input_value}
       onChange={handleOnchangeInfoCoupon}
      />
     </div>
     <div className={classes.input}>
      <div className={classes.input_title}>Mã khuyến mại</div>
      <input
       name="coupon_code"
       value={couponInfo.coupon_code}
       className={classes.input_value}
       onChange={handleOnchangeInfoCoupon}
      />
     </div>
     <div className={classes.input}>
      <div className={classes.input_title}>Ngày bắt đầu</div>
      <DatePicker
       value={couponInfo.start_date && moment(couponInfo.start_date)}
       className={classes.datePicker}
       onChange={(date, dateString) => onChangeStartDate(date, dateString)}
      />
     </div>
     <div className={classes.input}>
      <div className={classes.input_title}>Ngày kết thúc</div>
      <DatePicker
       value={couponInfo.end_date && moment(couponInfo.end_date)}
       className={classes.datePicker}
       onChange={(date, dateString) => onChangeEndDate(date, dateString)}
      />
     </div>
     <div className={classes.input}>
      <div className={classes.input_title}>Số lượng</div>
      <input
       value={couponInfo.limits}
       name="limits"
       className={classes.input_value}
       type="number"
       onChange={handleOnchangeInfoCoupon}
      />
     </div>
     <div className={classes.input}>
      <div className={classes.input_title}>Phần trăm giảm</div>
      <input
       value={couponInfo.discounts}
       name="discounts"
       className={classes.input_value}
       type="number"
       onChange={handleOnchangeInfoCoupon}
      />
     </div>
    </form>
   </div>
  </div>
 )
}

export default CreateCoupon
