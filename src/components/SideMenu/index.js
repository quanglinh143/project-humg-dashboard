import React, { useLayoutEffect, useState } from "react"
import { useLocation, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectActiveSidebar } from "stores/slices/sidebar/selectors"
import { useDataMenu } from "hooks/useDataMenu"
import classes from "./SideMenu.module.scss"

const SideMenu = () => {
 const location = useLocation()
 const { dataMenu } = useDataMenu()
 const [openSide, setOpenSide] = useState(0)
 const [openSideItem, setOpenSideItem] = useState(0)
 const activeSidebar1 = useSelector(selectActiveSidebar)
 const handleOpenSide = (index) => {
  if (index === openSide) {
   setOpenSide(null)
  }
  if (index !== "") {
   setOpenSide(index)
  } else {
   setOpenSide(0)
   setOpenSideItem("")
  }
 }

 const handleOpenSideItem = (index) => {
  setOpenSideItem(index)
 }

 useLayoutEffect(() => {
  const keySidebar = location.pathname.slice(
   1,
   location.pathname.lastIndexOf("/")
  )

  setOpenSide(keySidebar)
  setOpenSideItem(location.pathname)
 }, [location.pathname])

 return (
  <>
   <div className={classes.container}>
    <div className={classes.scrollBoxContent}>
     <div className={classes.scrollBoxContentItem}>
      <ul className={classes.menu}>
       {dataMenu.map((item, index) => {
        return (
         <li key={index}>
          <Link
           className={classes.menu_item}
           onClick={() => handleOpenSide(item.title)}
           to={item.link && item.link}
          >
           {item.icon}
           <span className={classes.menu_item_label}>{item.label}</span>
           <span
            className={`${
             openSide === item.title ? classes.active : classes.menuArrow
            } ${item.child.length === 0 ? classes.hideFirstArrow : ""}`}
           />
          </Link>
          {item.child && (
           <ul
            className={
             openSide === item.title ? classes.ingredient : classes.unActiveItem
            }
           >
            {item.child.map((ing, indexIng) => {
             return (
              <li className={classes.ingredient_item} key={indexIng}>
               <Link
                to={ing.link}
                className={`${classes.ingredient_item_link} ${
                 openSideItem === ing.link ? classes.activeItem : ""
                }`}
                onClick={() => handleOpenSideItem(`${ing.link}`)}
               >
                {ing.ingredient}
               </Link>
              </li>
             )
            })}
           </ul>
          )}
         </li>
        )
       })}
      </ul>
     </div>
    </div>
   </div>

   <div className={activeSidebar1 ? classes.mobile : classes.mobileHidden}>
    <div className={classes.scrollBoxContent}>
     <div className={classes.scrollBoxContentItem}>
      <ul className={classes.menu}>
       {dataMenu.map((item, index) => {
        return (
         <li key={index}>
          <Link
           className={classes.menu_item}
           onClick={() => handleOpenSide(index)}
           to={item.link && item.link}
          >
           {item.icon}
           <span className={classes.menu_item_label}>{item.label}</span>
           <span
            className={`${
             openSide === index ? classes.active : classes.menuArrow
            } ${item.child.length === 0 ? classes.hideFirstArrow : ""}`}
           />
          </Link>
          {item.child && (
           <ul
            className={
             openSide === index ? classes.ingredient : classes.unActiveItem
            }
           >
            {item.child.map((ing, indexIng) => {
             return (
              <li className={classes.ingredient_item} key={indexIng}>
               <Link
                to={ing.link}
                className={`${classes.ingredient_item_link} ${
                 openSideItem === ing.ingredient + index
                  ? classes.activeItem
                  : ""
                }`}
                onClick={() => handleOpenSideItem(`${ing.ingredient + index}`)}
               >
                {ing.ingredient}
               </Link>
              </li>
             )
            })}
           </ul>
          )}
         </li>
        )
       })}
      </ul>
     </div>
    </div>
   </div>
  </>
 )
}

export default SideMenu
