import Instance from "services/instance"
export function uploadImg(file, token) {
 const formData = new FormData()
 formData.append("file", file)
 return Instance.post("/api/upload", formData, {
  headers: { "content-type": "multipart/form-data", Authorization: token },
 })
}

export function deleteProduct(value, token) {
 return Instance.post("/api/destroy", value, token)
}
