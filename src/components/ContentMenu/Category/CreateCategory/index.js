import React, { useState } from "react"
import { createCategoryApi } from "services/api-client/categories"
import { openNotification } from "atomics/Notification"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import classes from "./CreateCategory.module.scss"

const CreateCategory = () => {
 const token = useSelector(selectToken)
 const [category, setCategory] = useState("")
 const handleChangeCategories = (e) => {
  setCategory(e.target.value)
 }

 const handleGotoCategoryList = () => {
  window.location.href = "/category/category_list"
 }

 // create
 const handleCreateCategory = async (event) => {
  event.preventDefault()
  try {
   const response = await createCategoryApi(
    { name: category },
    {
     headers: { Authorization: token },
    }
   )
   if (response.status === 200) {
    openNotification("success", "Thêm mới thành công.")
   }
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
  setCategory("")
 }
 return (
  <div className={classes.container}>
   <div className={classes.category}>
    <div className={classes.create}>
     <div className={classes.title}>Thêm mới thể loại</div>

     <form onSubmit={handleCreateCategory} className={classes.form}>
      <input
       type="text"
       name="category"
       value={category}
       className={classes.form_createCategory}
       required
       onChange={(e) => handleChangeCategories(e)}
       placeholder="Thêm mới thể loại!.."
      />
      <button type="submit" className={classes.form_btnSave}>
       Thêm mới
      </button>
     </form>
    </div>
    <div className={classes.categoryList} onClick={handleGotoCategoryList}>
     Đi đến danh sách thể loại
    </div>
   </div>
  </div>
 )
}

export default CreateCategory
