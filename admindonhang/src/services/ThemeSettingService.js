import fetch from 'auth/FetchInterceptor'

const themeSettingService = {}

themeSettingService.getAllThemeSetting = function () {
  return fetch({
    url: '/setting/list',
    method: 'get',
  })
}
themeSettingService.updateThemeSetting = function (formData) {
  return fetch({
    url: '/setting/update',
    method: 'put',
    data: formData
  })
}
themeSettingService.createThemeSetting = function (formData) {
  return fetch({
    url: '/setting/create',
    method: 'post',
    data: formData
  })
}
themeSettingService.deleteThemeSetting = function (formData) {
  return fetch({
    url: '/setting/delete',
    method: 'post',
    data: formData
  })
}

export default themeSettingService