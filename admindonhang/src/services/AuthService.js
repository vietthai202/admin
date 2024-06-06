import fetch from 'auth/FetchInterceptor'

const AuthService = {}

AuthService.login = function (data) {
	return fetch({
		url: '/User/Login',
		method: 'post',
		data: ({
			email: data.username,
			password: data.password
		})
	})
}

AuthService.register = function (data) {
	return fetch({
		url: '/auth/register',
		method: 'post',
		data: data
	})
}

AuthService.logout = function () {
	return fetch({
		url: '/User/LogOut',
		method: 'get'
	})
}

AuthService.isLogger = function () {
	const token = localStorage.getItem("auth_token");
	return !!token;
}

export default AuthService;