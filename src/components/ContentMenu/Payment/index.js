/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { getPaymentsByAdmin } from "services/api-client/payment"
import { selectToken } from "stores/slices/auth/selectors"
import Loading from "utils/Loading"

import classes from "./Payment.module.scss"
const Payment = () => {
 const [payments, setPayments] = useState([])
 const [loading, setLoading] = useState(false)
 const token = useSelector(selectToken)
 const getDataPayment = async () => {
  setLoading(true)
  try {
   const response = await getPaymentsByAdmin(token)
   setPayments(response.data)
  } catch (error) {
   console.log("error", error.msg || "Đã có lỗi xảy ra")
  }
  setLoading(false)
 }

 useEffect(() => {
  getDataPayment()
 }, [token])
 if (loading)
  return (
   <div className={classes.loading}>
    <Loading />
   </div>
  )

 return (
  <div>
   <div className={classes.container}>
    <h2 className={classes.title}>Lịch sử thanh toán</h2>
    <h4 className={classes.description}>
     Bạn có <span>{payments.length}</span> được thanh toán
    </h4>

    <table className={classes.table}>
     <thead className={classes.thead}>
      <tr>
       <th>ID</th>
       <th>Tình trạng</th>
       <th>Ngày đặt hàng</th>
       <th>Hành động</th>
      </tr>
     </thead>
     <tbody>
      {payments.map((item) => {
       return (
        <tr key={item._id}>
         <td>{item._id}</td>
         <td>
          {item.status === "0" && "Đang chờ xác nhận"}
          {item.status === "1" && "Đang vận chuyển"}
          {item.status === "2" && "Chưa nhận được hàng"}
          {item.status === "3" && "Đã nhận được hàng"}
          {item.status === "4" && "Hủy đơn hàng"}
         </td>
         <td>{new Date(item.createdAt).toLocaleDateString()}</td>
         <td>
          <Link to={`/payments/${item._id}`}>Chi tiết</Link>
         </td>
        </tr>
       )
      })}
     </tbody>
    </table>
   </div>
  </div>
 )
}

export default Payment
