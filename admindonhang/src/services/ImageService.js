import fetch from 'auth/FetchInterceptor'

const imageService = {}

imageService.getAllImage = function () {
  return fetch({
    url: '/image/list',
    method: 'get'
  })
}
imageService.uploadImage = function (formData) {
  return fetch({
    url: '/image/upload',
    method: 'post',
    data: formData
  })
}
imageService.deleteImage = function (id) {
  return fetch({
    url: '/image/delete/' + id,
    method: 'delete',
    params: id
  })
}
export default imageService