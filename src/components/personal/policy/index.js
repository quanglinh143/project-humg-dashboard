import React from 'react'
import { policyData } from './data'
const Policy = () => {
  return <div dangerouslySetInnerHTML={{ __html: policyData }}></div>
}

export default Policy
