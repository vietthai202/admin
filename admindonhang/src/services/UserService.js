import fetch from 'auth/FetchInterceptor'

const userService = {}

userService.getAllUser = function (params) {
  return fetch({
    url: '/User/GetAllUser',
    method: 'get',
  })
}

userService.getUserProfile = function (token) {
  return fetch({
    url: '/user/profile',
    method: 'get',
    data: token
  })
}

userService.updateUser = function (dataBody) {
  return fetch({
    url: '/User/UpdateAnUser',
    method: 'put',
    data: dataBody
  })
}

userService.getUserByUuid = function (data) {
  return fetch({
    url: '/user/getUser/?uuid=' + data.uuid,
    method: 'get',
  })
}

userService.addBalance = function (amount, uid, trans_type) {
  return fetch({
    url: '/user/addBalance/',
    method: 'put',
    data: ({
      amount: amount,
      uid: uid,
      trans_type: trans_type
    })
  })
}

userService.subBalance = function (amount, uid, trans_type) {
  return fetch({
    url: '/user/subBalance/',
    method: 'put',
    data: ({
      amount: amount,
      uid: uid,
      trans_type: trans_type
    })
  })
}

userService.setPost = function (data) {
  return fetch({
    url: '/posts',
    method: 'post',
    data: data
  })
}

userService.getUserId = function (params) {
  return fetch({
    url: '/User/GetAnUser/?Id=' + params,
    method: 'get',
    params
  })
}
userService.getCountUser = function () { 
  return fetch({
    url: '/User/GetCountUser',
    method: 'get',
  })
}
userService.confirmBalance = function (uuid) {
  return fetch({
    url: '/user/confirm',
    method: 'post',
    data: uuid
  })
}
userService.refuseBalance = function (uuid) {
  return fetch({
    url: '/user/refuse',
    method: 'post',
    data: uuid
  })
}

export default userService