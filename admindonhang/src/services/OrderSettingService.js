import fetch from 'auth/FetchInterceptor'

const orderSettingService = {}

orderSettingService.getOrderDetailByOrder = function (params) {
  return fetch({
    url: '/OrderDetail/GetAllOrderDetail/'+ params,
    method: 'get',
  })
}

orderSettingService.getAllOrderDetails = function () {
  return fetch({
    url: '/OrderDetail/GetAllOrderDetails',
    method: 'get',
    
  })
}

orderSettingService.createOrderSetting = function (formData) {
  return fetch({
    url: '/order_setting/create',
    method: 'post',
    data: formData
  })
}
orderSettingService.updateOrderSetting = function (formData) {
  return fetch({
    url: '/order_setting/update',
    method: 'put',
    data: formData
  })
}
orderSettingService.deleteOrderSetting = function (formData) {
  return fetch({
    url: '/order_setting/delete',
    method: 'post',
    data: formData
  })
}
orderSettingService.getAllOrderSettingByUser = function (formData) {
  return fetch({
    url: '/order_setting/getallbyuser',
    method: 'get',
    params: { user_id: formData }
  })
}
orderSettingService.getOrderCountTodayByUser = function (formData) {
  return fetch({
    url: '/order_setting/getordercounttodaybyuser',
    method: 'get',
    params: { user_id: formData }
  })
}


export default orderSettingService