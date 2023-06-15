import Instance from "services/instance"

export function getCouponsApi(currentPage, limit, search, sort, token) {
 return Instance.get(
  `/api/coupon/?page=${currentPage}&limit=${limit}&keyword=${search}&sort=${sort}`,
  {
   headers: { Authorization: token },
  }
 )
}

export function updateCouponApi(values, token) {
 return Instance.put(`/api/coupon/${values._id}`, values, {
  headers: { Authorization: token },
 })
}

export function deleteCouponApi(idActive, token) {
 return Instance.delete(`/api/coupon/${idActive}`, token)
}

export function createCouponApi(value, token) {
 return Instance.post("/api/coupon", value, token)
}
