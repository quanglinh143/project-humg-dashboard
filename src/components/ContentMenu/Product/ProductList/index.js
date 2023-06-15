import React, { useCallback, useEffect, useRef, useState } from "react"
import { getProductsApi, deleteProductApi } from "services/api-client/products"
import Loading from "utils/Loading"
import { Edit } from "icons"
import { Bin } from "icons"
import { Modal, Select } from "antd"
import { openNotification } from "atomics/Notification"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import ReactPaginate from "react-paginate"
import { CloseIcon } from "icons"
import { Search } from "icons"

import classes from "./ProductList.module.scss"
import { updateProductApi } from "services/api-client/products"
import Paginate from "utils/paginate"

const initialState = {
 name: "",
 price: 0,
 description: "",
 content: "",
 quantity: 0,
}

const ProductList = () => {
 const token = useSelector(selectToken)
 const [categories, setCategories] = useState([])
 const [pageCount, setPageCount] = useState(0)
 const currentPage = useRef()
 const limit = 6
 const [search, setSearch] = useState("")
 const [loading, setLoading] = useState(false)
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [updateCategory, setUpdateCategory] = useState(initialState)
 const [idActive, setIdActive] = useState("")
 const [filter, _] = useState({
  brand: [],
  category: [],
  price: 0,
 })
 const [sort, setSort] = useState("-createdAt")
 const getDataProducts = async () => {
  const response = await getProductsApi(
   search,
   currentPage.current,
   limit,
   filter,
   sort
  )
  if (response.status === 200) {
   setCategories(response.data.result)
   setPageCount(response.data.pageCount)
  }
 }

 const getCategories = async () => {
  setLoading(true)
  getDataProducts()
  setLoading(false)
 }

 useEffect(() => {
  currentPage.current = 1
  getCategories()
 }, [sort])

 const handleChangeUpdateCategories = (e) => {
  setUpdateCategory(e.target.value)
  const { name, value } = e.target
  setUpdateCategory({ ...updateCategory, [name]: value })
 }
 const handleUpdateCategory = async () => {
  try {
   const response = await updateProductApi(
    idActive,
    { values: updateCategory },
    {
     headers: { Authorization: token },
    }
   )
   if (response.status === 200) {
    getCategories()
   }
   setUpdateCategory("")
   setIsModalOpen(false)
   openNotification("success", "Cập nhật thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }
 const handleDeleteCategory = async (idCategory) => {
  try {
   const response = await deleteProductApi(idCategory, {
    headers: { Authorization: token },
   })
   if (response.status === 200) {
    getCategories()
   }
   setUpdateCategory("")
   setIsModalOpen(false)
   openNotification("success", "Cập nhật thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }

 const handleCancel = () => {
  setIsModalOpen(false)
 }
 const handleEditCategory = async (
  id,
  name,
  price,
  description,
  content,
  quantity,
  sold,
  remaining
 ) => {
  setIdActive(id)
  setUpdateCategory(name)
  setIsModalOpen(true)
  setUpdateCategory({
   name,
   price,
   description,
   content,
   quantity,
   sold,
   remaining,
  })
 }

 const handlePageClick = async (e) => {
  currentPage.current = e.selected + 1
  getDataProducts()
 }

 const handleSubmitSearch = (event) => {
  event.preventDefault()
  currentPage.current = 1
  getCategories()
 }

 const handleChangeSearch = useCallback(
  (e) => {
   setSearch(e.target.value)
  },
  [search]
 )

 const handleEventSearch = () => {
  document.getElementById("idSearchInput").focus()
 }

 const handleClearValueSearch = useCallback(() => {
  setSearch("")
  document.getElementById("idSearchInput").focus()
 }, [search])

 //filter
 const itemSortByCreatedAt = [
  {
   value: "-createdAt",
   label: "Mới nhất",
  },
  {
   value: "createdAt",
   label: "Cũ nhất",
  },
  {
   value: "-sold",
   label: "Bán chạy nhất",
  },
  {
   value: "name",
   label: "Tên sản phẩm (A to Z)",
  },
  {
   value: "-name",
   label: "Tên sản phẩm (Z to A)",
  },
 ]
 const handleChangeValueCreatedAt = (value) => {
  setSort(value)
 }
 const renderFilterByCreatedAt = () => {
  return (
   <Select
    onChange={handleChangeValueCreatedAt}
    className={classes.buttonSort}
    defaultValue={0}
    value={sort}
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
     value={search}
     onChange={handleChangeSearch}
     className={classes.searchInput}
     id="idSearchInput"
    />
    {search.length !== 0 && (
     <CloseIcon
      className={classes.closeIcon}
      onClick={handleClearValueSearch}
     />
    )}
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
    <div>
     <input
      type="text"
      name="name"
      value={updateCategory.name}
      className={classes.form_updateCategory}
      autoFocus
      onChange={(e) => handleChangeUpdateCategories(e)}
      placeholder="Tên sản phẩm.."
     />
     <input
      type="number"
      name="price"
      value={updateCategory?.price}
      className={classes.form_updateCategory}
      autoFocus
      onChange={(e) => handleChangeUpdateCategories(e)}
      placeholder="Giá..!"
     />
     <textarea
      type="text"
      name="description"
      value={updateCategory.description}
      className={classes.form_updateCategoryTextArea}
      autoFocus
      onChange={(e) => handleChangeUpdateCategories(e)}
      placeholder="Mô tả.."
     />
     <input
      type="text"
      name="content"
      value={updateCategory.content}
      className={classes.form_updateCategory}
      autoFocus
      onChange={(e) => handleChangeUpdateCategories(e)}
      placeholder="Nội dung.."
     />
     <input
      type="number"
      name="quantity"
      value={updateCategory.quantity}
      className={classes.form_updateCategory}
      autoFocus
      onChange={(e) => handleChangeUpdateCategories(e)}
      placeholder="Số lượng.."
      min={0}
     />
    </div>
    <div className={classes.modalUpdate_btn}>
     <button
      className={classes.modalUpdate_btn_update}
      onClick={handleUpdateCategory}
     >
      Cập nật
     </button>
     <button className={classes.modalUpdate_btn_cancel} onClick={handleCancel}>
      Hủy
     </button>
    </div>
   </Modal>
  )
 }
 return (
  <div className={classes.container}>
   <div className={classes.category}>
    <div className={classes.categoryHead}>
     {renderSearchCategory()}
     {renderFilterByCreatedAt()}
    </div>
    <table className={classes.table}>
     <thead>
      <tr className={classes.rowHead}>
       <th className={classes.rowHead_name}>Tên sản phẩm</th>
       <th>Ảnh</th>
       <th>Số lượng nhập</th>
       <th>Đã bán</th>
       <th>Hành động</th>
      </tr>
     </thead>
     <tbody>
      {categories &&
       categories.map((item) => {
        return (
         <tr className={classes.categoryItem} key={item._id}>
          <td>{item.name}</td>
          <td>
           <img
            src={item.images.url}
            alt={item.images.url}
            className={classes.img}
           />
          </td>
          <td>{item.quantity}</td>
          <td>{item.sold}</td>
          <td className={classes.actions}>
           <div
            className={classes.edit}
            onClick={() =>
             handleEditCategory(
              item._id,
              item.name,
              item.price,
              item.description,
              item.content,
              item.quantity,
              item.sold,
              item.remaining
             )
            }
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
    <Paginate
     onHandlePageClick={handlePageClick}
     pageCount={pageCount}
     currentPage={currentPage.current - 1}
    />
   </div>
   {renderModalFormUpdate()}
  </div>
 )
}

export default ProductList
