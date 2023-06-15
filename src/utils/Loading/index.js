import React, { useContext, useState } from 'react'
import ClockLoader from 'react-spinners/ClockLoader'
const Loading = () => {
  let [loading, setLoading] = useState(true)
  let [color, setColor] = useState('#f5a442')

  return (
    <div style={{ width: '80px', height: '80px' }}>
      <ClockLoader color={color} loading={loading} size={80} />
    </div>
  )
}

export default Loading
