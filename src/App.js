import Menu from "components/Menu"
import NotFound from "utils/Notfound"
import Login from "components/Auth/Login"
import { Route, Routes } from "react-router-dom"
import { CreateProduct } from "components/ContentMenu/Product"
import { ProductList } from "components/ContentMenu/Product"
import { CategoryList } from "components/ContentMenu/Category"
import { CreateCategory } from "components/ContentMenu/Category"
import { BrandList } from "components/ContentMenu/Brand"
import { CreateBrand } from "components/ContentMenu/Brand"
import Dashboard from "components/ContentMenu/Dashboard"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Personal from "components/personal"
import Payment from "components/ContentMenu/Payment"
import PaymentDetails from "components/ContentMenu/Payment/PaymentDetails"
import CreateCoupon from "components/ContentMenu/Coupon/CreateCoupon"
import CouponList from "components/ContentMenu/Coupon/CouponList"

function App() {
 const navigate = useNavigate()
 const login = localStorage.getItem("login") || ""
 useEffect(() => {
  if (!login) {
   navigate("/login")
  }
 }, [login, navigate])
 return (
  <div className="container">
   <Routes>
    <Route
     path="/"
     exact
     element={
      <Menu>
       <Dashboard />
      </Menu>
     }
    />
    <Route path="/login" element={<Login />} />
    <Route
     path="/product/product_list"
     element={
      <Menu>
       <ProductList />
      </Menu>
     }
    />

    <Route
     path="/product/create_product"
     element={
      <Menu>
       <CreateProduct />
      </Menu>
     }
    />

    <Route
     path="/category/category_list"
     element={
      <Menu>
       <CategoryList />
      </Menu>
     }
    />
    <Route
     path="/category/create_category"
     element={
      <Menu>
       <CreateCategory />
      </Menu>
     }
    />
    <Route
     path="/brand/brand_list"
     element={
      <Menu>
       <BrandList />
      </Menu>
     }
    />
    <Route
     path="/brand/create_brand"
     element={
      <Menu>
       <CreateBrand />
      </Menu>
     }
    />
    <Route
     path="/coupon/coupon_list"
     element={
      <Menu>
       <CouponList />
      </Menu>
     }
    />
    <Route
     path="/coupon/create_coupon"
     element={
      <Menu>
       <CreateCoupon />
      </Menu>
     }
    />
    <Route
     path="/payments"
     element={
      <Menu>
       <Payment />
      </Menu>
     }
    />
    <Route
     path="/payments/:id"
     element={
      <Menu>
       <PaymentDetails />
      </Menu>
     }
    />
    <Route
     path="/settings"
     element={
      <Menu>
       <Personal />
      </Menu>
     }
    />
    <Route path="*" element={<NotFound />} />
   </Routes>
  </div>
 )
}

export default App
