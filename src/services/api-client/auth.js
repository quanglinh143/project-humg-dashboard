import Instance from "services/instance"
import InstanceWithFormData from "services/instanceWithFormData"

export function loginApi(values) {
 const { email, password } = values

 const formData = new FormData()
 formData.append("email", email)
 formData.append("password", password)
 return InstanceWithFormData(formData, "/user/login_dashboard")
}

export function logoutApi() {
 return Instance.get("/user/logout")
}

export function refreshTokenApi() {
 return Instance.get("/user/refresh_token")
}
