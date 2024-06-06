import fetch from 'auth/FetchInterceptor'

const vipService = {}

vipService.getAllVip = function (params) {
  return fetch({
    url: '/vip/list',
    method: 'get',
    params
  })
}

vipService.createVip = function (dataBody) {
  return fetch({
    url: '/vip/create',
    method: 'post',
    data: dataBody
  })
}

vipService.updateVip = function (dataBody) {
  return fetch( {
      url: '/vip/update',
      method: 'put',
      data: dataBody
  })
}

vipService.deleteVip = function (data) {
  return fetch( {
      url: '/vip/delete',
      method: 'post',
      data:data
    })
}

vipService.setPost = function (data) {
  return fetch({
    url: '/posts',
    method: 'post',
    data: data
  })
}

export default vipService