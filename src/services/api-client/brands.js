import Instance from "services/instance"

export function createBrandApi(value, token) {
 return Instance.post("/api/brand", value, token)
}

export function getBrandsApi(currentPage, limit, search, sort) {
 return Instance.get(
  `/api/brand/?page=${currentPage}&limit=${limit}&keyword=${search}&sort=${sort}`
 )
}

export function updateBrandApi(idActive, values, token) {
 return Instance.put(`/api/brand/${idActive}`, values, token)
}

export function deleteBrandApi(idActive, token) {
 return Instance.delete(`/api/brand/${idActive}`, token)
}

export function selectBrands() {
 return Instance.get("/api/brand_all")
}
