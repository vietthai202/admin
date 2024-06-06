import fetch from 'auth/FetchInterceptor'

const productService = {}

productService.getAllProduct = function () {
  return fetch({
    url: '/Product/GetAllProduct',
    method: 'get',
  })
}
productService.createProduct = function (formData) {
  return fetch({
    url: '/Product/AddAProduct' ,
    method: 'post',
    data: formData
  })
}
productService.updateProduct = function (formData) {
  return fetch({
    url: '/Product/UpdateAProduct',
    method: 'post',
    data: formData
  })
}
productService.deleteProduct = function (formData) {
  return fetch({
    url: '/Product/DeleteAProduct?Id='+formData,
    method: 'post',
    
  })
}


export default productService