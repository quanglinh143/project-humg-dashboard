import React, { useLayoutEffect, useState } from "react"
import { useGetWidth } from "hooks/useGetWidth"

import classes from "./Content.module.scss"

const ContentMenu = ({ children }) => {
 const width = useGetWidth()
 const [hiddenSideBar, setHiddenSideBar] = useState(false)
 useLayoutEffect(() => {
  if (width <= 1000) {
   setHiddenSideBar(true)
  } else {
   setHiddenSideBar(false)
  }
 }, [width])
 return (
  <div className={hiddenSideBar ? classes.hiddenSideBar : classes.container}>
   {children}
  </div>
 )
}

export default ContentMenu
