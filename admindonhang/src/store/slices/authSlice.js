import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';

import { AUTH_TOKEN } from 'constants/AuthConstant';
import AuthService from 'services/AuthService'; 

export const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN) || null
}

export const signIn = createAsyncThunk('User/Login', async (data, { rejectWithValue }) => {
	const { username, password } = data
	try {
		const response = await AuthService.login({ username, password })
		if(response.roleId === 1){
			message.error('Đăng nhập thất bại, bạn không có quyền truy cập');
			return rejectWithValue('Unauthorized');
		}
		const token = response.token;
		localStorage.setItem(AUTH_TOKEN, token);
		localStorage.setItem('role', response.roleId);
		
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const signOut = createAsyncThunk('auth/logout', async () => {
	localStorage.removeItem(AUTH_TOKEN);
	return "Login successfully!"
})

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false
			state.redirect = '/'
			state.token = action.payload
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload
			state.showMessage = true
			state.loading = false
		},
		hideAuthMessage: (state) => {
			state.message = ''
			state.showMessage = false
		},
		signOutSuccess: (state) => {
			state.loading = false
			state.token = null
			state.redirect = '/'
		},
		showLoading: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.loading = false
			state.token = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signIn.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signOut.fulfilled, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
			.addCase(signOut.rejected, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
	},
})

export const {
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
	signInSuccess
} = authSlice.actions

export default authSlice.reducer