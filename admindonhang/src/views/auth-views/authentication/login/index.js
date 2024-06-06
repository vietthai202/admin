import { Card, Col, Row, Typography } from "antd";
import LoginForm from '../../components/LoginForm';

const backgroundStyle = {
	backgroundImage: 'url(/img/others/img-17.jpg)',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover'
}

const Login = props => {
	return (
		<div className="h-100" style={backgroundStyle}>
			<div className="container d-flex flex-column justify-content-center h-100">
				<Row justify="center">
					<Col xs={20} sm={20} md={20} lg={10}>
						<Card>
							<div className="my-4">
								<Row justify="center">
									<Col xs={24} sm={24} md={20} lg={20}>
										<Typography.Title level={3} style={{ textAlign: "center" }}>
											ADMIN LOGIN
										</Typography.Title>
										<LoginForm {...props} />
									</Col>
								</Row>
							</div>
						</Card>
					</Col>
				</Row>
			</div>
		</div>
	)
}

export default Login
