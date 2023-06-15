import Instance from "services/instance"

export function getPaymentsByAdmin(token) {
 return Instance.get("/api/payment", {
  headers: { Authorization: token },
 })
}

export function getPaymentDetailsByAdmin(token, id) {
 return Instance.get(`/api/paymentAdmin/${id}`, {
  headers: { Authorization: token },
 })
}

export function orderStatusPayment(item, status) {
 return Instance.post(`/api/orderStatus`, { item, status })
}

export function getRevenuesApi(startDate, endDate) {
 return Instance.get(`/api/revenue?startDate=${startDate}&endDate=${endDate}`)
}
