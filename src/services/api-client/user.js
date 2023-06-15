import Instance from "services/instance"

export function getUserApi(token) {
 return Instance.get("/user/info", {
  headers: { Authorization: token },
 })
}

export function getTotalCustomersApi(currentPage, limit) {
 return Instance.get(
  `/user/getTotalUser/?currentPage=${currentPage}&limit=${limit}`
 )
}

export function resetPasswordApi(values) {
 return Instance.post(
  "/user/changePassword",
  {
   id: values.id,
   oldPassword: values.newPassword.oldPassword,
   password: values.newPassword.password,
   rePassword: values.newPassword.rePassword,
  },
  {
   headers: { Authorization: values.token },
  }
 )
}
