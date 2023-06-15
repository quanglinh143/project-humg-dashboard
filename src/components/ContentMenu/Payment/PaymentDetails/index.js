/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"

import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import { getPaymentDetailsByAdmin } from "services/api-client/payment"
import { useParams } from "react-router-dom"

import classes from "./PaymentDetails.module.scss"
import Loading from "utils/Loading"
import { orderStatusPayment } from "services/api-client/payment"
import { openNotification } from "atomics/Notification"

const PaymentDetails = () => {
 const token = useSelector(selectToken)
 const { id } = useParams()
 const [paymentDetails, setPaymentDetails] = useState([])
 const [loading, setLoading] = useState(false)
 const [status, setStatus] = useState("")

 const getDataPayment = async () => {
  setLoading(true)
  try {
   if (token) {
    const response = await getPaymentDetailsByAdmin(token, id)
    setPaymentDetails(response.data)
    setStatus(response.data.status)
   }
  } catch (error) {
   console.log("error", error.msg || "Đã có lỗi xảy ra")
  }
  setLoading(false)
 }

 useEffect(() => {
  getDataPayment()
 }, [token, id, status])
 if (loading)
  return (
   <div className={classes.loading}>
    <Loading />
   </div>
  )

 const handelOrderStatusPayment = async (item, status) => {
  try {
   const response = await orderStatusPayment(item, status)
   if (response.status === 200) {
    setStatus(status)
   }
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }

 const statusOrder = () => {
  return (
   <div className={classes.order}>
    <h2 className={classes.order_title}>Tình trạng đơn hàng:</h2>
    <div className={classes.order_status}>
     {status === "0" && (
      <h3 className={classes.order_status_title}>
       Đơn hàng đang được chờ xác nhận:
      </h3>
     )}
     {status === "1" && (
      <h3 className={classes.order_status_title}>
       Đơn hàng đang được vận chuyển..
      </h3>
     )}
     {status === "2" && (
      <h3 className={classes.order_status_title}>Người mua xác nhận:</h3>
     )}
     {status === "3" && (
      <h3 className={classes.order_status_title}>Người mua xác nhận:</h3>
     )}
     {status === "4" && (
      <h3 className={classes.order_status_title}>Người mua xác nhận:</h3>
     )}

     {status === "0" && (
      <button
       onClick={() => handelOrderStatusPayment(paymentDetails, "1")}
       className={`${classes.order_status_noti} ${classes.order_status_transported_received}`}
      >
       Xác nhận
      </button>
     )}

     {status === "2" && (
      <div
       className={`${classes.order_status_noti} ${classes.order_status_result}`}
      >
       Chưa nhận được hàng
      </div>
     )}
     {status === "3" && (
      <div
       className={`${classes.order_status_noti} ${classes.order_status_result}`}
      >
       Đã nhận hàng
      </div>
     )}
     {status === "4" && (
      <div
       className={`${classes.order_status_noti} ${classes.order_status_result}`}
      >
       Đơn hàng đã bị hủy
      </div>
     )}
    </div>
   </div>
  )
 }

 return (
  <div className={classes.container}>
   <div className={classes.paymentCard}>
    <h2 className={classes.listDetail_title}>Thông tin giao hàng:</h2>
    <table>
     <thead>
      <tr>
       <th>Tên Khách hàng</th>
       <th>Số điện thoại</th>
       <th>Địa chỉ</th>
       <th>Phương thức thanh toán</th>
       <th>Email Khách hàng</th>
      </tr>
     </thead>
     <tbody>
      <tr>
       <td>{paymentDetails?.name}</td>
       <td>{paymentDetails?.phone_number}</td>
       <td>{paymentDetails?.address}</td>
       <td>
        {paymentDetails?.methodShipping === "0"
         ? "Chuyển khoản"
         : "Thanh toán khi nhận hàng"}
       </td>
       <td>{paymentDetails?.email}</td>
      </tr>
     </tbody>
    </table>

    <div className={classes.listDetail}>
     <h2 className={classes.listDetail_title}>Sản phẩm thanh toán:</h2>
     <table>
      <thead>
       <tr>
        <th>STT</th>
        <th>Tên sản phẩm</th>
        <th>Hình ảnh</th>
        <th>Số lượng mua</th>
        <th>Đơn giá</th>
        <th>Thành tiền</th>
       </tr>
      </thead>
      <tbody>
       {paymentDetails?.cart?.map((item, index) => {
        return (
         <tr key={item._id}>
          <td>{index + 1}</td>
          <td>{item?.name}</td>
          <td className={classes.listDetail_img}>
           <img src={item?.images?.url} alt="" />
          </td>
          <td>{item?.qty}</td>
          <td className={classes.price}>
           {item?.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
           })}
          </td>
          <td className={classes.price}>
           {paymentDetails?.totalPurchasePrice.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
           })}
          </td>
         </tr>
        )
       })}
      </tbody>
     </table>
    </div>
    {statusOrder()}
   </div>
  </div>
 )
}

export default PaymentDetails
