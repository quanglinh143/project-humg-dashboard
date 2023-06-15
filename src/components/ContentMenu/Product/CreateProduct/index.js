import React, { useEffect, useState } from "react"
import Close from "icons/close.svg"
import Loading from "utils/Loading"
import Download from "icons/download.svg"
import { openNotification } from "atomics/Notification"
import { uploadImg } from "services/api-client/uploadImg"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"
import { deleteProduct } from "services/api-client/uploadImg"
import { createProducts } from "services/api-client/products"
import { selectBrands } from "services/api-client/brands"
import { selectCategories } from "services/api-client/categories"
import classes from "./CreateProduct.module.scss"
import { CloseIcon } from "icons"

const initialState = {
 name: "",
 price: 0,
 description: "",
 content: "",
 category: "",
 brand: "",
 quantity: 0,
}

const CreateProduct = () => {
 const token = useSelector(selectToken)
 const [product, setProduct] = useState(initialState)
 const [imageProduct, setImageProduct] = useState(null)
 const [loading, setLoading] = useState(false)
 const [loadingImg, setLoadingImg] = useState(false)
 const [optionBrands, setOptionBrands] = useState([])
 const [optionCategories, setOptionCategories] = useState([])
 const handleUploadImg = async (event) => {
  event.persist()
  try {
   const file = event.target.files[0]
   if (!file) openNotification("warning", "Data does not exist.")
   if (file.size > 1024 * 1024)
    openNotification("warning", "The data is too big.")
   if (
    file.type !== "image/jpeg" &&
    file.type !== "image/png" &&
    file.type !== "image/jpg"
   )
    openNotification("warning", "Incorrect data!")

   setLoadingImg(true)
   const res = await uploadImg(file, token)
   if (res.status === 200) {
    setImageProduct(res.data)
    event.target.value = null
   }
  } catch (error) {
   openNotification("error", "Đã có lỗi xảy ra")
  }
  setLoadingImg(false)
 }

 const handleDestroyImg = async () => {
  setLoadingImg(true)
  try {
   await deleteProduct(
    { public_id: imageProduct?.public_id },
    {
     headers: { Authorization: token },
    }
   )
   setImageProduct(null)
  } catch (error) {
   openNotification("error", "Đã có lỗi xảy ra")
  }
  setLoadingImg(false)
 }

 const handleSubmit = async (event) => {
  event.preventDefault()
  try {
   const res = await createProducts(
    { ...product, images: imageProduct },
    {
     headers: { Authorization: token },
    }
   )

   if (res.status === 200) {
    setProduct(initialState)
    setImageProduct(null)
    openNotification("success", res.data.msg)
   }
  } catch (error) {
   openNotification("error", error.msg)
  }
 }

 const fetchAll = async () => {
  setLoading(true)
  try {
   const [getDataOptionCategories, getDataOptionBrands] = await Promise.all([
    selectCategories(),
    selectBrands(),
   ])

   if (
    getDataOptionCategories.status === 200 &&
    getDataOptionBrands.status === 200
   ) {
    setOptionCategories(getDataOptionCategories.data.result)
    setOptionBrands(getDataOptionBrands.data.result)
   }
  } catch (error) {
   console.log("error", error)
  }
  setLoading(false)
 }
 useEffect(() => {
  fetchAll()
 }, [])

 const handleChangeInput = (e) => {
  const { name, value } = e.target
  setProduct({ ...product, [name]: value })
 }

 if (loading)
  return (
   <div className={classes.loading}>
    <Loading />
   </div>
  )
 return (
  <div className={classes.container}>
   <div className={classes.create}>
    <h2 className={classes.create_title}>Thêm mới sản phẩm</h2>

    <div className={classes.create_item}>
     <div className={classes.create_item_img}>
      <input
       type="file"
       name="file"
       onChange={handleUploadImg}
       id="inUploadImg"
       className={classes.create_item_img_inputFile}
      />
      {imageProduct && (
       <div
        className={classes.create_item_img_iconClose}
        onClick={handleDestroyImg}
       >
        <CloseIcon />
       </div>
      )}
      {loadingImg ? (
       <Loading />
      ) : (
       imageProduct && (
        <img
         src={imageProduct?.url}
         alt=""
         className={classes.create_item_img_product}
        />
       )
      )}
      {!imageProduct && (
       <label
        className={`${
         loadingImg
          ? classes.create_item_img_iconCloseActive
          : classes.create_item_img_icon
        }`}
        htmlFor="inUploadImg"
       >
        <img src={Download} alt={Download} />
       </label>
      )}
     </div>
     <div className={classes.create_item_info}>
      <div className={classes.create_item_info_form}>
       <form onSubmit={handleSubmit}>
        <div className={classes.create_item_info_form_item}>
         <label>Tên sản phẩm</label>
         <input name="name" value={product.name} onChange={handleChangeInput} />
        </div>
        <div className={classes.create_item_info_form_item}>
         <label>Giá</label>
         <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChangeInput}
         />
        </div>
        <div className={classes.create_item_info_form_item}>
         <label>Mô tả</label>
         <textarea
          rows={4}
          name="description"
          value={product.description}
          onChange={handleChangeInput}
         />
        </div>
        <div className={classes.create_item_info_form_item}>
         <label>Nội dung</label>
         <input
          name="content"
          value={product.content}
          onChange={handleChangeInput}
         />
        </div>
        <div className={classes.create_item_info_form_category}>
         <label className={classes.create_item_info_form_category_title}>
          Thể loại
         </label>

         <select
          onChange={handleChangeInput}
          className={classes.select}
          name="category"
          value={product.category}
         >
          <option value="">Vui lòng chọn thể loại!</option>
          {optionCategories &&
           optionCategories.map((option) => {
            return (
             <option name="category" value={option._id}>
              {option.name}
             </option>
            )
           })}
         </select>
        </div>
        <div className={classes.create_item_info_form_category}>
         <label className={classes.create_item_info_form_category_title}>
          Nhãn hàng
         </label>

         <select
          className={classes.select}
          onChange={handleChangeInput}
          name="brand"
          value={product.brand}
         >
          <option value="">Vui lòng chọn nhãn hàng!</option>
          {optionBrands &&
           optionBrands.map((option) => {
            return (
             <option value={option._id} className={classes.option}>
              {option.name}
             </option>
            )
           })}
         </select>
        </div>

        <div className={classes.create_item_info_form_category}>
         <label className={classes.create_item_info_form_category_title}>
          Sô lượng
         </label>
         <input
          name="quantity"
          value={product.quantity}
          onChange={handleChangeInput}
          className={classes.inputNumber}
          type="number"
         />
        </div>
        <button
         className={`${classes.create_item_info_form_submit} ${
          loading ? classes.btnDisabled : ""
         }`}
         type="submit"
         disabled={loading}
        >
         Thêm mới sản phẩm
        </button>
       </form>
      </div>
     </div>
    </div>
   </div>
  </div>
 )
}

export default CreateProduct
