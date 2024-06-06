
import { useEffect, useState } from 'react';
import {
	LogoutOutlined
} from '@ant-design/icons';
import styled from '@emotion/styled';
import { Avatar, Dropdown } from 'antd';
import Flex from 'components/shared-components/Flex';
import { FONT_SIZES, FONT_WEIGHT, MEDIA_QUERIES, SPACER } from 'constants/ThemeConstant';
import { useDispatch } from 'react-redux';
import { signOut } from 'store/slices/authSlice';
import NavItem from './NavItem';
import userService from 'services/UserService';

const Icon = styled.div(() => ({
	fontSize: FONT_SIZES.LG
}))

const Profile = styled.div(() => ({
	display: 'flex',
	alignItems: 'center'
}))

const UserInfo = styled('div')`
	padding-left: ${SPACER[2]};

	@media ${MEDIA_QUERIES.MOBILE} {
		display: none
	}
`

const Name = styled.div(() => ({
	fontWeight: FONT_WEIGHT.SEMIBOLD
}))

const Title = styled.span(() => ({
	opacity: 0.8
}))

const MenuItemSignOut = (props) => {
	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(signOut())
	}

	return (
		<div onClick={handleSignOut}>
			<Flex alignItems="center" gap={SPACER[2]} >
				<Icon>
					<LogoutOutlined />
				</Icon>
				<span>{props.label}</span>
			</Flex>
		</div>
	)
}

const items = [
	{
		key: 'Sign Out',
		label: <MenuItemSignOut label="Sign Out" />,
	}
]

export const NavProfile = ({ mode }) => {
	const [userName, setUsername] = useState('')
	const [role, setRole] = useState('')
	const token = localStorage.getItem('auth_token')
	const fetchData = async (token) => {
		// await userService.getUserProfile(token).then((data) => {
		// 	setUsername(data?.data?.full_name)
		// 	setRole(data?.data?.role)
		// }).catch((error) => {
		// 	console.error("ERROR");
		// })
	}
	useEffect(() => {
		fetchData()
	}, []);
	return (
		<Dropdown placement="bottomRight" menu={{ items }} trigger={["click"]}>
			<NavItem mode={mode}>
				<Profile>
					<Avatar src="/img/logo.png" />
					<UserInfo className="profile-text">
						<Name>{userName}</Name>
						<Title>{role}</Title>
					</UserInfo>
				</Profile>
			</NavItem>
		</Dropdown>
	);
}

export default NavProfile
