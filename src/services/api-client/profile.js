import Instance from "services/instance"

export function getCurrentInforApi() {
 return Instance.get("/user/info")
}

export function updateUserInfoApi(value, token) {
 return Instance.post("/user/updateInfo", value, token)
}
