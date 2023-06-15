import { PrinterIcon } from "icons"
import {
 HomeIcon,
 DashboardIcon,
 BrandIcon,
 CategoryIcon,
 ProductIcon,
 SettingIcon,
 LogoutIcon,
} from "icons"
import { useMemo } from "react"
import { logoutApi } from "services/api-client/auth"

export const useDataMenu = () => {
 const backToHomepage = () => {
  window.location.href = "/"
 }

 const handleLogout = async () => {
  try {
   const response = await logoutApi()
   if (response.status === 200) {
    localStorage.removeItem("login")
    localStorage.removeItem("admin")
    localStorage.removeItem("authToken")
    window.location.href = "/login"
   }
  } catch (error) {
   console.log("error logout:", error)
  }

  // navigate('/login')
 }

 const dataMenu = useMemo(() => {
  return [
   {
    icon: <DashboardIcon />,
    label: "Dashboard",
    title: "",
    callback: backToHomepage,
    link: "/",
    child: [],
   },
   {
    icon: <ProductIcon />,
    label: "Sản phẩm",
    title: "product",
    child: [
     {
      ingredient: "Danh sách sản phẩm",
      link: "/product/product_list",
     },
     {
      ingredient: "Thêm sản phẩm",
      link: "/product/create_product",
     },
    ],
   },
   {
    icon: <CategoryIcon />,
    label: "Thể loại",
    title: "category",
    child: [
     {
      ingredient: "Danh sách thể loại",
      link: "/category/category_list",
     },
     {
      ingredient: "Thêm thể loại",
      link: "/category/create_category",
     },
    ],
   },
   {
    icon: <BrandIcon />,
    label: "Nhãn hàng",
    title: "brand",
    child: [
     {
      ingredient: "Danh sách nhãn hàng",
      link: "/brand/brand_list",
     },
     {
      ingredient: "Thêm nhãn hàng",
      link: "/brand/create_brand",
     },
    ],
   },
   {
    icon: <BrandIcon />,
    label: "Mã giảm giá",
    title: "coupon",
    child: [
     {
      ingredient: "Danh sách mã giảm",
      link: "/coupon/coupon_list",
     },
     {
      ingredient: "Thêm mã giảm",
      link: "/coupon/create_coupon",
     },
    ],
   },
   {
    icon: <PrinterIcon />,
    label: "Thanh toán",
    title: "",
    link: "/payments",
    child: [],
   },
   {
    icon: <SettingIcon />,
    label: "Cài đặt",
    title: "",
    link: "/settings",
    child: [],
   },
  ]
 }, [])

 const dataMenuProfile = useMemo(() => {
  const goToSetting = () => {
   window.location.href = "/settings"
  }
  return [
   {
    icon: <HomeIcon />,
    label: "Trang chủ",
    callback: backToHomepage,
    link: "/",
   },
   {
    icon: <SettingIcon />,
    label: "Cài đặt",
    callback: goToSetting,
    link: "/settings",
   },
   {
    icon: <LogoutIcon />,
    label: "Đăng xuất",
    callback: handleLogout,
   },
  ]
 }, [])

 return {
  dataMenu,
  dataMenuProfile,
 }
}
