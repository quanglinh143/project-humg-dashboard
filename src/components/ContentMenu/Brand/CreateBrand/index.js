import React, { useState } from "react"
import { createBrandApi } from "services/api-client/brands"
import { openNotification } from "atomics/Notification"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import classes from "./CreateBrand.module.scss"

const CreateBrand = () => {
 const token = useSelector(selectToken)
 const [brand, setBrand] = useState("")
 const handleChangeBrands = (e) => {
  setBrand(e.target.value)
 }

 const handleGotoBrandList = () => {
  window.location.href = "/brand/brand_list"
 }

 // create
 const handleCreateBrand = async (event) => {
  event.preventDefault()
  try {
   const response = await createBrandApi(
    { name: brand },
    {
     headers: { Authorization: token },
    }
   )
   if (response.status === 200) {
    openNotification("success", "Thêm hãng sản xuất mới thành công")
   }
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
  setBrand("")
 }

 return (
  <div className={classes.container}>
   <div className={classes.brand}>
    <div className={classes.create}>
     <div className={classes.title}>Thêm mới nhãn hàng</div>

     <form onSubmit={handleCreateBrand} className={classes.form}>
      <input
       type="text"
       name="brand"
       value={brand}
       className={classes.form_createBrand}
       required
       onChange={(e) => handleChangeBrands(e)}
       placeholder="Thêm mới nhãn hàng.."
      />
      <button type="submit" className={classes.form_btnSave}>
       Thêm mới
      </button>
     </form>
    </div>
    <div className={classes.brandList} onClick={handleGotoBrandList}>
     Đi đến danh sách nhãn hàng
    </div>
   </div>
  </div>
 )
}

export default CreateBrand
