import React from 'react'
import { Button, notification, Space } from 'antd'
export const openNotification = (type, message) => {
  notification[type]({
    message: message,
    placement: 'bottomLeft',
    duration: 3,
  })
}
