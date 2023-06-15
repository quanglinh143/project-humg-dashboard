import React, { useCallback, useEffect, useRef, useState } from "react"

import classes from "./CategoryList.module.scss"
import { getCategoryApi } from "services/api-client/categories"
import Loading from "utils/Loading"
import { Edit } from "icons"
import { Bin } from "icons"
import { Modal, Select } from "antd"
import { openNotification } from "atomics/Notification"
import {
 updateCategoryApi,
 deleteCategoryApi,
} from "services/api-client/categories"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import moment from "moment"
import { CloseIcon } from "icons"
import { Search } from "icons"
import Paginate from "components/Paginate"
import NotFound from "utils/Notfound"

const CategoryList = () => {
 const token = useSelector(selectToken)
 const [categories, setCategories] = useState([])
 const [pageCount, setPageCount] = useState(0)
 const currentPage = useRef()
 const limit = 6
 const [search, setSearch] = useState("")
 const [onChangeSearch, setOnchangeSearch] = useState("")
 const [loading, setLoading] = useState(false)
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [updateCategory, setUpdateCategory] = useState("")
 const [idActive, setIdActive] = useState("")

 // value input search

 const [sortBy, setSortBy] = useState("-createdAt")

 const getDataCategories = useCallback(async () => {
  try {
   const response = await getCategoryApi(
    currentPage.current,
    limit,
    search,
    sortBy
   )
   if (response.status === 200) {
    setCategories(response.data.result)
    setPageCount(response.data.pageCount)
   }
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }, [search, sortBy])

 const getCategories = async () => {
  setLoading(true)
  getDataCategories()
  setLoading(false)
 }

 useEffect(() => {
  currentPage.current = 1
  getCategories()
 }, [sortBy, search])

 const handleChangeUpdateCategories = (e) => {
  setUpdateCategory(e.target.value)
 }

 const handleUpdateCategory = async () => {
  try {
   const response = await updateCategoryApi(
    idActive,
    { name: updateCategory },
    {
     headers: { Authorization: token },
    }
   )
   if (response.status === 200) {
    getCategories()
   }
   setUpdateCategory("")
   setIsModalOpen(false)
   openNotification("success", "Cập nhật thể loại thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }
 const handleDeleteCategory = async (idCategory) => {
  try {
   const response = await deleteCategoryApi(idCategory, {
    headers: { Authorization: token },
   })
   if (response.status === 200) {
    getCategories()
   }
   setUpdateCategory("")
   setIsModalOpen(false)
   openNotification("success", "Cập nhật thể loại thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }

 const handleCancel = () => {
  setIsModalOpen(false)
 }
 const handleEditCategory = async (id, name) => {
  setIdActive(id)
  setUpdateCategory(name)
  setIsModalOpen(true)
 }

 const handlePageClick = async (e) => {
  currentPage.current = e.selected + 1
  getDataCategories()
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

 const renderSearchCategory = () => {
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

 const renderModalFormUpdate = () => {
  return (
   <Modal
    open={isModalOpen}
    title="Bạn có muốn thay đổi?"
    className={classes.modalUpdate}
    onCancel={handleCancel}
   >
    <input
     type="text"
     name="category"
     value={updateCategory}
     className={classes.form_updateCategory}
     autoFocus
     onChange={(e) => handleChangeUpdateCategories(e)}
     placeholder="Thay đổi thể loại..."
    />
    <div className={classes.modalUpdate_btn}>
     <button
      className={classes.modalUpdate_btn_update}
      onClick={handleUpdateCategory}
     >
      Cập nhật
     </button>
     <button className={classes.modalUpdate_btn_cancel} onClick={handleCancel}>
      Hủy
     </button>
    </div>
   </Modal>
  )
 }

 const tableData = () => {
  return (
   <div className={classes.category}>
    <div className={classes.category}>
     <div className={classes.categoryHead}>
      {renderSearchCategory()}
      {renderFilterByCreatedAt()}
     </div>

     {categories.length > 0 ? (
      <table className={classes.table}>
       <thead>
        <tr className={classes.rowHead}>
         <th>Thể loại</th>
         <th>Ngày tạo</th>
         <th>Tạo bởi</th>
         <th>Hành động</th>
        </tr>
       </thead>
       <tbody>
        {categories.map((item, index) => {
         return (
          <tr className={classes.categoryItem} key={item._id}>
           <td>{item.name}</td>
           <td>{moment(item?.createdAt).format("DD/MM/YYYY")}</td>
           <td>Admin</td>
           <td className={classes.actions}>
            <div
             className={classes.edit}
             onClick={() => handleEditCategory(item._id, item.name)}
            >
             <Edit />
            </div>
            <div>
             <Bin
              className={classes.bin}
              onClick={() => handleDeleteCategory(item._id)}
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

export default CategoryList
