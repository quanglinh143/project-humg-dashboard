import Instance from "services/instance"

export function getProductsApi(search, currentPage, limit, filter, sort) {
 return Instance.get(
  `/api/products?keyword=${search}&page=${currentPage}&limit=${limit}&filter=${JSON.stringify(
   filter
  )}&sort=${sort}`
 )
}

export function createProducts(value, token) {
 return Instance.post("/api/products", value, token)
}

export function updateProductApi(idActive, values, token) {
 return Instance.put(`/api/products/${idActive}`, values, token)
}

export function deleteProductApi(idActive, token) {
 return Instance.post(`/api/products/${idActive}`, token)
}

export function selectProducts() {
 return Instance.get("/api/product_all")
}

export function aaaa(search, currentPage, limit, filter, sort) {
 return Instance.get(
  `/api/products?keyword=${search}&page=${currentPage}&limit=${limit}&filter=${JSON.stringify(
   filter
  )}&sort=${sort}`
 )
}
