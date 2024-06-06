import fetch from 'auth/FetchInterceptor'

const transactionService = {}

transactionService.getAllTransaction = function () {
  return fetch({
    url: '/Order/GetCountOrder',
    method: 'get',
  })
}

transactionService.getAllOrder = function () {
  return fetch({
    url: '/Order/GetAllOrder',
    method: 'get',
  })
}

transactionService.getAllOrders = function () {
  return fetch({
    url: '/Order/GetAllOrders',
    method: 'get',
  })
}

transactionService.UpdateOrder = function (params) {
  return fetch({
    url: '/Order/UpdateAOrder?Id='+ params,
    method: 'post',
  })
}



transactionService.getTypeTransaction = function (type) {
  return fetch({
    url: '/transaction/find',
    method: 'get',
    params: type
  })
}
transactionService.deleteTransaction = function (formData) {
  return fetch({
    url: '/transaction/delete',
    method: 'post',
    data: formData
  })
}


export default transactionService