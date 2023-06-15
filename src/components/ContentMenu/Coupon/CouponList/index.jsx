import React, { useCallback, useEffect, useRef, useState } from "react"

import classes from "./CouponList.module.scss"
import Loading from "utils/Loading"
import { Edit } from "icons"
import { Bin } from "icons"
import { DatePicker, Modal, Select, Switch } from "antd"
import { openNotification } from "atomics/Notification"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import moment from "moment"
import { CloseIcon } from "icons"
import { Search } from "icons"
import Paginate from "components/Paginate"
import NotFound from "utils/Notfound"
import { getCouponsApi } from "services/api-client/coupon"
import { updateCouponApi } from "services/api-client/coupon"
import { deleteCouponApi } from "services/api-client/coupon"

const CouponList = () => {
 const token = useSelector(selectToken)
 const [coupons, setCoupons] = useState([])
 const [pageCount, setPageCount] = useState(0)
 const currentPage = useRef()
 const limit = 6
 const [search, setSearch] = useState("")
 const [onChangeSearch, setOnchangeSearch] = useState("")
 const [loading, setLoading] = useState(false)
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [updateCoupon, setUpdateCoupon] = useState("")
 const [idActive, setIdActive] = useState("")
 const [checked, setChecked] = useState(false)

 // value input search

 const [sortBy, setSortBy] = useState("-createdAt")

 const getDataCoupons = async () => {
  setLoading(true)
  if (token) {
   try {
    const response = await getCouponsApi(
     currentPage.current,
     limit,
     search,
     sortBy,
     token
    )
    if (response.status === 200) {
     setCoupons(response.data.result)
     setPageCount(response.data.pageCount)
    }
   } catch (error) {
    openNotification("error", error.msg || "Đã có lỗi xảy ra")
   }
  }
  setLoading(false)
 }

 useEffect(() => {
  currentPage.current = 1
  getDataCoupons()
 }, [token, sortBy, search])
 console.log("coupon =>>>", coupons)

 //  const handleChangeUpdateCoupons = (e) => {
 //   setUpdateCoupon(e.target.value)
 //  }

 const handleUpdateCoupon = async (event) => {
  event.preventDefault()
  if (token) {
   try {
    const response = await updateCouponApi(updateCoupon, token)
    if (response.status === 200) {
     console.log("response", response)
     // getDataCoupons()
    }
    // setUpdateCoupon("")
    // setIsModalOpen(false)
    openNotification("success", "Cập nhật thành công")
   } catch (error) {
    openNotification("error", error.msg || "Đã có lỗi xảy ra FE")
   }
  }
 }

 const handleDeleteCoupon = async (idCoupon) => {
  try {
   const response = await deleteCouponApi(idCoupon, token)
   if (response.status === 200) {
    getDataCoupons()
   }
   setUpdateCoupon("")
   setIsModalOpen(false)
   openNotification("success", response.data.msg || "Xóa mã thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }

 const handleCancel = () => {
  setIsModalOpen(false)
 }
 const handleEditCoupon = async (item) => {
  console.log("item", item)
  setIdActive(item._id)
  setChecked(item?.status)
  setUpdateCoupon(item)
  setIsModalOpen(true)
 }
 console.log("checked =>>", checked)
 const handlePageClick = async (e) => {
  currentPage.current = e.selected + 1
  getDataCoupons()
 }

 const handleSubmitSearch = (event) => {
  event.preventDefault()
  setSearch(onChangeSearch)
 }

 const handleChangeSearch = useCallback(
  (e) => {
   setOnchangeSearch(e.target.value)
  },
  [onChangeSearch]
 )

 const handleEventSearch = () => {
  document.getElementById("idSearchInput").focus()
 }

 const handleClearValueSearch = useCallback(() => {
  setSearch("")
  setOnchangeSearch("")
  document.getElementById("idSearchInput").focus()
 }, [search, onChangeSearch])

 //filter
 const itemSortByCreatedAt = [
  {
   value: "-createdAt",
   label: "newest",
  },
  {
   value: "createdAt",
   label: "oldest",
  },
  {
   value: "name",
   label: "name (A to Z)",
  },
  {
   value: "-name",
   label: "name (Z to A)",
  },
 ]
 const handleChangeValueCreatedAt = (value) => {
  setSortBy(value)
 }
 const renderFilterByCreatedAt = () => {
  return (
   <Select
    onChange={handleChangeValueCreatedAt}
    className={classes.buttonSort}
    defaultValue="createdAt"
    value={sortBy}
    options={itemSortByCreatedAt}
   />
  )
 }

 if (loading)
  return (
   <div className={classes.loading}>
    <Loading />
   </div>
  )

 const renderSearchCoupon = () => {
  return (
   <form onSubmit={handleSubmitSearch} className={classes.searchForm}>
    <Search className={classes.closeSearch} onClick={handleEventSearch} />
    <input
     value={onChangeSearch}
     onChange={handleChangeSearch}
     className={classes.searchInput}
     id="idSearchInput"
    />
    <CloseIcon className={classes.closeIcon} onClick={handleClearValueSearch} />
   </form>
  )
 }

 const handleOnchangeInfoCoupon = (event) => {
  const { name, value } = event.target
  setUpdateCoupon({ ...updateCoupon, [name]: value })
 }

 function onChangeStartDate(_, dateString) {
  setUpdateCoupon({ ...updateCoupon, start_date: dateString })
 }

 function onChangeEndDate(_, dateString) {
  setUpdateCoupon({ ...updateCoupon, end_date: dateString })
 }

 const onChangeActiveCoupon = (checked) => {
  setChecked(checked)
  setUpdateCoupon({ ...updateCoupon, status: checked })
 }

 const renderModalFormUpdate = () => {
  return (
   <Modal
    open={isModalOpen}
    title="Bạn có muốn thay đổi?"
    className={classes.modalUpdate}
    onCancel={handleCancel}
   >
    {/* <input
     type="text"
     name="coupon"
     value={updateCoupon}
     className={classes.form_updateCoupon}
     autoFocus
     onChange={(e) => handleChangeUpdateCoupons(e)}
     placeholder="..."
    />
    <div className={classes.modalUpdate_btn}>
     <button
      className={classes.modalUpdate_btn_update}
      onClick={handleUpdateCoupon}
     >
      Cập nhật
     </button>
     <button className={classes.modalUpdate_btn_cancel} onClick={handleCancel}>
      Hủy
     </button>
    </div> */}
    <div className={classes.updateCoupon}>
     <div className={classes.coupon}>
      <div className={classes.create}></div>
      <form onSubmit={handleUpdateCoupon}>
       <div className={classes.actions}>
        <div className={classes.checked}>
         <Switch
          // defaultChecked
          onChange={onChangeActiveCoupon}
          defaultChecked={checked}
          className={updateCoupon?.status ? classes.checked_switch : ""}
         />
         <span className={classes.checked_text}>
          {checked ? "Active" : "Inactive"}
         </span>
        </div>
        <div>
         <button className={classes.addNew} type="submit">
          Chỉnh sửa
         </button>
        </div>
       </div>
       <div className={classes.endline} />
       <div className={classes.input}>
        <div className={classes.input_title}>Sư kiện</div>
        <input
         name="name"
         className={classes.input_value}
         value={updateCoupon?.name}
         onChange={handleOnchangeInfoCoupon}
        />
       </div>
       <div className={classes.input}>
        <div className={classes.input_title}>Mã khuyến mãi</div>
        <input
         name="code"
         className={classes.input_value}
         value={updateCoupon?.code}
         onChange={handleOnchangeInfoCoupon}
        />
       </div>
       <div className={classes.input}>
        <div className={classes.input_title}>
         Ngày bắt đầu{" "}
         {updateCoupon?.start_date &&
          moment(updateCoupon.start_date).format("YYYY/MM/DD")}
        </div>
        <DatePicker
         className={classes.datePicker}
         //  value={updateCoupon?.start_date}
         //  value={updateCoupon.start_date && moment(updateCoupon.start_date)}
         onChange={onChangeStartDate}
        />
       </div>
       <div className={classes.input}>
        <div className={classes.input_title}>
         Ngày kết thúc{" "}
         {updateCoupon?.end_date &&
          moment(updateCoupon.end_date).format("YYYY/MM/DD")}
        </div>
        <DatePicker
         className={classes.datePicker}
         //  value={
         //   updateCoupon?.end_date &&
         //   moment(updateCoupon?.start_date).format("YYYY/MM/DD")
         //  }
         onChange={onChangeEndDate}
        />
       </div>
       <div className={classes.input}>
        <div className={classes.input_title}>Số lượng</div>
        <input
         name="limits"
         className={classes.input_value}
         type="number"
         value={updateCoupon?.limits}
         onChange={handleOnchangeInfoCoupon}
        />
       </div>
       <div className={classes.input}>
        <div className={classes.input_title}>Phần trăm giảm</div>
        <input
         name="discounts"
         className={classes.input_value}
         type="number"
         value={updateCoupon?.discounts}
         onChange={handleOnchangeInfoCoupon}
        />
       </div>
      </form>
     </div>
    </div>
   </Modal>
  )
 }

 const tableData = () => {
  return (
   <div className={classes.coupon}>
    <div className={classes.coupon}>
     <div className={classes.couponHead}>
      {renderSearchCoupon()}
      {renderFilterByCreatedAt()}
     </div>

     {coupons.length > 0 ? (
      <table className={classes.table}>
       <thead>
        <tr className={classes.rowHead}>
         <th>Số lượng</th>
         <th>Sự kiện</th>
         <th>Mã khuyến mại</th>
         <th>Giảm (%)</th>
         <th>Ngày bắt đầu</th>
         <th>Ngày kết thúc</th>
         <th>Tình trạng</th>
         <th>Hành động</th>
        </tr>
       </thead>
       <tbody>
        {coupons.map((item) => {
         return (
          <tr className={classes.couponItem} key={item._id}>
           <td>{item?.limits}</td>
           <td>{item?.name}</td>
           <td>{item?.code}</td>
           <td>{item?.discounts}</td>
           <td>{moment(item?.start_date).format("DD/MM/YYYY")}</td>
           <td>{moment(item?.end_date).format("DD/MM/YYYY")}</td>
           <td>{item?.status ? "Active" : "Inactive"}</td>
           <td className={classes.actions}>
            <div
             className={classes.edit}
             onClick={() => handleEditCoupon(item)}
            >
             <Edit />
            </div>
            <div>
             <Bin
              className={classes.bin}
              onClick={() => handleDeleteCoupon(item._id)}
             />
            </div>
           </td>
          </tr>
         )
        })}
       </tbody>
      </table>
     ) : (
      <NotFound />
     )}
    </div>

    <Paginate
     onHandlePageClick={handlePageClick}
     pageCount={pageCount}
     currentPage={currentPage.current - 1}
    />
   </div>
  )
 }

 return (
  <div className={classes.container}>
   {tableData()}
   {renderModalFormUpdate()}
  </div>
 )
}

export default CouponList
