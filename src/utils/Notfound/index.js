import React from "react"

import classes from "./NotFound.module.scss"
const NotFound = ({ description }) => {
 return (
  <div className={classes.container}>
   <img
    src="/images/notFound.png"
    alt="images/notFound.png"
    className={classes.img}
   />
   <div className={classes.description}>
    {description ? description : "No result is found"}
   </div>
  </div>
 )
}

export default NotFound
