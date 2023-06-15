import Instance from "services/instance"

const defaultContentType = "multipart/form-data"
const InstanceWithFormData = (formData, url) => {
 return Instance({
  url,
  method: "post",
  data: formData,
  headers: {
   "Content-Type": defaultContentType,
  },
 })
}

export default InstanceWithFormData
