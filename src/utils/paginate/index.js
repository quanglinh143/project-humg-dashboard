import React from "react"
import ReactPaginate from "react-paginate"

import classes from "./Paginate.module.scss"
const Paginate = ({ onHandlePageClick, pageCount, currentPage }) => {
 return (
  <ReactPaginate
   breakLabel="..."
   nextLabel="sau >"
   onPageChange={onHandlePageClick}
   pageRangeDisplayed={3}
   pageCount={pageCount}
   previousLabel="< trước"
   renderOnZeroPageCount={null}
   className={classes.paginate}
   // page={currentPage}
   forcePage={currentPage}
  />
 )
}

export default Paginate
