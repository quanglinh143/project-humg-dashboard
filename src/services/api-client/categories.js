import Instance from "services/instance"

export function createCategoryApi(value, token) {
 return Instance.post("/api/category", value, token)
}

export function getCategoryApi(currentPage, limit, search, sort) {
 return Instance.get(
  `/api/category/?page=${currentPage}&limit=${limit}&keyword=${search}&sort=${sort}`
 )
}

export function updateCategoryApi(idActive, values, token) {
 return Instance.put(`/api/category/${idActive}`, values, token)
}

export function deleteCategoryApi(idActive, token) {
 return Instance.delete(`/api/category/${idActive}`, token)
}

export function selectCategories() {
 return Instance.get("/api/category_all")
}
