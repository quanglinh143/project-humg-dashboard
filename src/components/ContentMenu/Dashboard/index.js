import React, { useEffect, useMemo, useState } from "react"
import { getRevenuesApi } from "services/api-client/payment"
import { getTotalCustomersApi } from "services/api-client/user"
import { selectBrands } from "services/api-client/brands"
import { selectCategories } from "services/api-client/categories"
import { selectProducts } from "services/api-client/products"
import { getPaymentsByAdmin } from "services/api-client/payment"
import { CategoryIcon } from "icons"
import Paginate from "utils/paginate"
import { DatePicker, Skeleton } from "antd"
import { DollarsIcon } from "icons"
import { Pie } from "@ant-design/plots"
import { useSelector } from "react-redux"
import { selectToken } from "stores/slices/auth/selectors"

import classes from "./Dashboard.module.scss"

const Dashboard = () => {
 const token = useSelector(selectToken)
 const [startDate, setStartDate] = useState("")
 const [endDate, setEndDate] = useState("")
 const [customersList, setCustomersList] = useState([])
 const [totalCustomers, setTotalCustomers] = useState("")
 const [totalProducts, setTotalProducts] = useState("")
 const [totalCategories, setTotalCategories] = useState("")
 const [totalBrands, setTotalBrands] = useState("")
 const [totalPurchasePrice, setTotalPurchasePrice] = useState([])
 const [payments, setPayments] = useState([])
 const [loading, setLoading] = useState(false)

 let limit = 5
 const [pageCount, setPageCount] = useState(1)
 const [currentPage, setCurrentPage] = useState(0)

 const dataMenu = useMemo(() => {
  return [
   {
    icon: <CategoryIcon />,
    title: "Khách hàng",
    data: totalCustomers,
   },
   {
    icon: <CategoryIcon />,
    title: "Sản phẩm",
    data: totalProducts,
   },
   {
    icon: <CategoryIcon />,
    title: "Thể loại",
    data: totalCategories,
   },
   {
    icon: <CategoryIcon />,
    title: "Nhãn hàng",
    data: totalBrands,
   },
  ]
 }, [totalCustomers, totalProducts, totalCategories, totalBrands])

 const fetchAllDataDashboard = async () => {
  setLoading(true)
  if (token) {
   try {
    const [
     getTotalCustomersDataResult,
     getTotalProductsDataResult,
     getRevenuesDataResult,
     getTotalCategoriesDataResult,
     getTotalBrandsDataResult,
     getPaymentsListByAdmin,
    ] = await Promise.all([
     getTotalCustomersApi(currentPage + 1, limit),
     selectProducts(),
     getRevenuesApi(startDate, endDate),
     selectCategories(),
     selectBrands(),
     getPaymentsByAdmin(token),
    ])
    if (
     getTotalCustomersDataResult.status === 200 &&
     getTotalProductsDataResult.status === 200 &&
     getRevenuesDataResult.status === 200 &&
     getTotalCategoriesDataResult.status === 200 &&
     getTotalBrandsDataResult.status === 200 &&
     getPaymentsListByAdmin.status === 200
    ) {
     setTotalCustomers(getTotalCustomersDataResult.data.total)
     setPageCount(getTotalCustomersDataResult.data.pageCount)
     setTotalProducts(getTotalProductsDataResult.data.total)
     setTotalPurchasePrice(getRevenuesDataResult.data.totalPurchasePrice)
     setTotalCategories(getTotalCategoriesDataResult.data.total)
     setTotalBrands(getTotalBrandsDataResult.data.total)
     setCustomersList(getTotalCustomersDataResult.data.result)
     setPayments(getPaymentsListByAdmin.data)
    }
   } catch (error) {
    console.log("error", error)
   }
  }
  setLoading(false)
 }
 console.log("payments", payments)
 useEffect(() => {
  fetchAllDataDashboard()
 }, [startDate, endDate, currentPage, token])

 const handlePageClick = async (e) => {
  setCurrentPage(e.selected)
 }

 const handleChangerRangeDate = (_, rangeDate) => {
  if (rangeDate[0] !== "" && rangeDate[1] !== "") {
   setStartDate(new Date(rangeDate[0]).setHours(0, 0, 0, 0))
   setEndDate(new Date(rangeDate[1]).setHours(23, 59, 59, 999))
  } else {
   setStartDate("")
   setEndDate("")
  }
 }

 const headContent = () => {
  return (
   <div className={classes.headContent}>
    <ul className={classes.headContent_list}>
     {dataMenu.map((item, index) => {
      return (
       <li
        key={`${item.title} ${index}`}
        className={classes.headContent_list_item}
       >
        <div className={classes.headContent_list_item_data}>
         <div className={classes.headContent_list_item_data_total}>
          {item.data ? item.data : "Updating"}
         </div>
         <div className={classes.headContent_list_item_data_title}>
          {item.title}
         </div>
        </div>

        <div className={classes.headContent_list_item_icon}>{item.icon}</div>
       </li>
      )
     })}
    </ul>
   </div>
  )
 }

 const StatusOrderPie = payments.reduce((counts, fruit) => {
  if (counts[fruit.status]) {
   counts[fruit.status] += 1
  } else {
   counts[fruit.status] = 1
  }
  return counts
 }, {})

 const StatusOrderPieArray = Object.entries(StatusOrderPie).map(
  ([type, value]) => {
   const customType = (type) => {
    if (type === "0") {
     return "Đang chờ xác nhận"
    }
    if (type === "1") {
     return "Đang vận chuyển"
    }
    if (type === "2") {
     return "Chưa nhận được hàng"
    }
    if (type === "3") {
     return "Đã nhận được hàng"
    }
    if (type === "4") {
     return "Đơn hàng bị hủy"
    }
   }
   return {
    type: customType(type),
    value,
   }
  }
 )

 const pie = () => {
  const data = StatusOrderPieArray
  const config = {
   appendPadding: 10,
   data,
   angleField: "value",
   colorField: "type",
   radius: 0.9,
   label: {
    type: "inner",
    offset: "-30%",
    content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
    style: {
     fontSize: 14,
     textAlign: "center",
    },
   },
   interactions: [
    {
     type: "element-active",
    },
   ],
  }
  return <Pie {...config} />
 }

 const documents = () => {
  return (
   <div className={classes.documentsContent}>
    <div className={classes.documentsContent_users}>
     <table className={classes.table}>
      <thead>
       <tr className={classes.rowHead}>
        <th className={classes.rowHead_name}>Tên khách hàng</th>
        <th>Email</th>
        <th>Hạng</th>
        <th>Tổng thanh toán</th>
       </tr>
      </thead>
      <tbody>
       {customersList &&
        customersList.map((item) => {
         return (
          <tr className={classes.categoryItem} key={item._id}>
           <td>{item.name}</td>
           <td>{item.email}</td>
           <td>{item.rank}</td>
           <td>
            {item.totalPayment.toLocaleString("it-IT", {
             style: "currency",
             currency: "VND",
            })}
           </td>
          </tr>
         )
        })}
      </tbody>
     </table>
     <Paginate
      onHandlePageClick={handlePageClick}
      pageCount={pageCount}
      currentPage={currentPage}
     />
    </div>
    <div className={classes.documentsContent_revenues}>
     <div className={classes.documentsContent_revenues_filterDate}>
      <DatePicker.RangePicker
       className={classes.documentsContent_revenues_filterDate_rangeDate}
       onChange={handleChangerRangeDate}
      />
     </div>
     <div className={classes.totalSalesDue}>
      <div className={classes.totalSalesDue_item}>
       <div className={classes.totalSalesDue_item_total}>
        {totalPurchasePrice.toLocaleString("it-IT", {
         style: "currency",
         currency: "VND",
        })}
       </div>
       <div className={classes.totalSalesDue_item_title}>
        Tổng doanh thu đến hạn
       </div>
      </div>

      <div className={classes.totalSalesDue_icons}>
       <DollarsIcon />
      </div>
     </div>
     {pie()}
    </div>
   </div>
  )
 }

 if (loading) return <Skeleton />
 return (
  <div className={classes.container}>
   <div className={classes.content}>
    {headContent()}
    {documents()}
   </div>
  </div>
 )
}

export default Dashboard
