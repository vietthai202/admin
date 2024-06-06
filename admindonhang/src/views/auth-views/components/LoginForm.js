import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import { motion } from "framer-motion";
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthService from 'services/AuthService';
import {
	hideAuthMessage,
	showAuthMessage,
	showLoading,
	signIn,
} from 'store/slices/authSlice';

export const LoginForm = props => {

	const navigate = useNavigate();

	const {
		showForgetPassword,
		hideAuthMessage,
		onForgetPasswordClick,
		showLoading,
		extra,
		signIn,
		token,
		loading,
		redirect,
		showMessage,
		Message,
		allowRedirect = true
	} = props

	const initialCredential = {
		username: 'abc@gmail.com',
		password: '123'
	}

	const onLogin = (values) => {
		showLoading()
		signIn(values);
		// AuthService.login(values)
		// .then((data) => {
		// 	navigate(redirect)
		// })

	};

	useEffect(() => {
		if (token !== null && allowRedirect) {
			navigate(redirect)
		}
		if (showMessage) {
			const timer = setTimeout(() => hideAuthMessage(), 3000)
			return () => {
				clearTimeout(timer);
			};
		}
	});

	return (
		<>
			{/* <motion.div
				initial={{ opacity: 0, marginBottom: 0 }}
				animate={{
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0
				}}>
				<Alert type="error" showIcon message={Message}></Alert>
			</motion.div> */}
			<Form
				layout="vertical"
				name="login-form"
				initialValues={initialCredential}
				onFinish={onLogin}
			>
				<Form.Item
					name="username"
					label="Tên đăng nhập"
					rules={[
						{
							required: true,
							message: 'Vui lòng điền tên đăng nhập',
						}
					]}>
					<Input prefix={<UserOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item
					name="password"
					label={
						<div className={`${showForgetPassword ? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
							<span>Mật khẩu</span>
							{
								showForgetPassword &&
								<span
									onClick={() => onForgetPasswordClick}
									className="cursor-pointer font-size-sm font-weight-normal text-muted"
								>
									Forget Password?
								</span>
							}
						</div>
					}
					rules={[
						{
							required: true,
							message: 'Vui lòng điền mật khẩu',
						}
					]}
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} />
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" block loading={loading}>
						Đăng nhập
					</Button>
				</Form.Item>
				{extra}
			</Form>
		</>
	)
}

LoginForm.propTypes = {
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	showForgetPassword: false
};

const mapStateToProps = ({ auth }) => {
	const { loading, message, showMessage, token, redirect } = auth;
	return { loading, message, showMessage, token, redirect }
}

const mapDispatchToProps = {
	signIn,
	showAuthMessage,
	showLoading,
	hideAuthMessage,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
