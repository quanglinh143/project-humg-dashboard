import React, { useCallback, useEffect, useRef, useState } from "react"
import Loading from "utils/Loading"
import { Edit } from "icons"
import { Bin } from "icons"
import { Modal, Select } from "antd"
import { openNotification } from "atomics/Notification"
import {
 getBrandsApi,
 updateBrandApi,
 deleteBrandApi,
} from "services/api-client/brands"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import moment from "moment"
import { CloseIcon } from "icons"
import { Search } from "icons"

import classes from "./BrandList.module.scss"
import Paginate from "components/Paginate"
import NotFound from "utils/Notfound"

const BrandList = () => {
 const token = useSelector(selectToken)
 const [brands, seBrands] = useState([])
 const [pageCount, setPageCount] = useState(0)
 const currentPage = useRef()
 const limit = 6
 const [search, setSearch] = useState("")
 const [onChangeSearch, setOnchangeSearch] = useState("")
 const [loading, setLoading] = useState(false)
 const [isModalOpen, setIsModalOpen] = useState(false)
 const [updateBrand, setUpdateBrand] = useState("")
 const [idActive, setIdActive] = useState("")

 // value input search

 const [sortBy, setSortBy] = useState("-createdAt")

 const getDataBrands = useCallback(async () => {
  try {
   const response = await getBrandsApi(
    currentPage.current,
    limit,
    search,
    sortBy
   )
   if (response.status === 200) {
    seBrands(response.data.result)
    setPageCount(response.data.pageCount)
   }
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }, [search, sortBy])

 const getBrands = async () => {
  setLoading(true)
  getDataBrands()
  setLoading(false)
 }

 useEffect(() => {
  currentPage.current = 1
  getBrands()
 }, [sortBy, search])

 const handleChangeUpdateBrands = (e) => {
  setUpdateBrand(e.target.value)
 }

 const handleUpdateBrand = async () => {
  try {
   const response = await updateBrandApi(
    idActive,
    { name: updateBrand },
    {
     headers: { Authorization: token },
    }
   )
   if (response.status === 200) {
    getBrands()
   }
   setUpdateBrand("")
   setIsModalOpen(false)
   openNotification("success", "Cập nhật thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }
 const handleDeleteBrand = async (idBrand) => {
  try {
   const response = await deleteBrandApi(idBrand, {
    headers: { Authorization: token },
   })
   if (response.status === 200) {
    getBrands()
   }
   setUpdateBrand("")
   setIsModalOpen(false)
   openNotification("success", "Cập nhật thành công")
  } catch (error) {
   openNotification("error", error.msg || "Đã có lỗi xảy ra")
  }
 }

 const handleCancel = () => {
  setIsModalOpen(false)
 }
 const handleEditBrand = async (id, name) => {
  setIdActive(id)
  setUpdateBrand(name)
  setIsModalOpen(true)
 }

 const handlePageClick = async (e) => {
  currentPage.current = e.selected + 1
  getDataBrands()
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

 const renderSearchBrand = () => {
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
     name="brand"
     value={updateBrand}
     className={classes.form_updateBrand}
     autoFocus
     onChange={(e) => handleChangeUpdateBrands(e)}
     placeholder="Thay đổi nhãn hàng..."
    />
    <div className={classes.modalUpdate_btn}>
     <button
      className={classes.modalUpdate_btn_update}
      onClick={handleUpdateBrand}
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
   <div className={classes.brand}>
    <div className={classes.brand}>
     <div className={classes.brandHead}>
      {renderSearchBrand()}
      {renderFilterByCreatedAt()}
     </div>

     {brands.length > 0 ? (
      <table className={classes.table}>
       <thead>
        <tr className={classes.rowHead}>
         <th>Tên nhãn hàng</th>
         <th>Ngày khởi tạo</th>
         <th>Tạo bởi</th>
         <th>Hành động</th>
        </tr>
       </thead>
       <tbody>
        {brands.map((item, index) => {
         return (
          <tr className={classes.brandItem} key={item._id}>
           <td>{item.name}</td>
           <td>{moment(item?.createdAt).format("DD/MM/YYYY")}</td>
           <td>Admin</td>
           <td className={classes.actions}>
            <div
             className={classes.edit}
             onClick={() => handleEditBrand(item._id, item.name)}
            >
             <Edit />
            </div>
            <div>
             <Bin
              className={classes.bin}
              onClick={() => handleDeleteBrand(item._id)}
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

export default BrandList
