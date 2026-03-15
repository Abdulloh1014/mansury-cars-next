import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Link from 'next/link';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import { signOut } from 'next-auth/react';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: any = router.query?.category ?? 'myProfile';
	const user = useReactiveVar(userVar);

	const logoutHandler = async () => {
    try {
        if (await sweetConfirmAlert('Do you want to logout?')) {
            // 1. localStorage tozala
            localStorage.removeItem('accessToken');
            localStorage.setItem('logout', Date.now().toString());
            
            // 2. userVar reset
            userVar({
                _id: '', memberType: '', memberStatus: '',
                memberAuthType: '', memberPhone: '', memberNick: '',
                memberFullName: '', memberImage: '', memberAddress: '',
                memberDesc: '', memberCars: 0, memberRank: 0,
                memberArticles: 0, memberPoints: 0, memberLikes: 0,
                memberViews: 0, memberWarnings: 0, memberBlocks: 0,
            });

            // 3. next-auth session tozala
            await signOut({ redirect: false });

            // 4. Redirect
            window.location.href = '/';
        }
    } catch (err: any) {
        console.log('ERROR, logoutHandler:', err.message);
    }
};

	if (device === 'mobile') return <div>MY MENU</div>;

	return (
		<Stack className={'my-menu-wrap'}>
			{/* ── COVER BANNER ── */}
			<div className={'cover-banner'}>
				<div className={'cover-overlay'} />
				<div className={'cover-content'}>
					<div className={'cover-avatar'}>
						<img
							src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
							alt={'member-photo'}
						/>
					</div>
					<div className={'cover-info'}>
						<Typography className={'cover-name'}>{user?.memberNick}</Typography>
						<Typography className={'cover-phone'}>{user?.memberPhone}</Typography>
						{user?.memberType === 'ADMIN' ? (
							<a href="/_admin/users" target={'_blank'}>
								<Typography className={'cover-type admin'}>{user?.memberType}</Typography>
							</a>
						) : (
							<Typography className={'cover-type'}>{user?.memberType}</Typography>
						)}
					</div>
					<button className={'cover-logout'} onClick={logoutHandler}>
						Logout
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</button>
				</div>
			</div>

			{/* ── HORIZONTAL TAB BAR ── */}
			<div className={'tab-bar'}>
				{user.memberType === 'AGENT' && (
					<>
						<Link href={{ pathname: '/mypage', query: { category: 'addCar' } }} scroll={false}>
							<div className={`tab-item ${category === 'addCar' ? 'active' : ''}`}>Add Car</div>
						</Link>
						<Link href={{ pathname: '/mypage', query: { category: 'myCars' } }} scroll={false}>
							<div className={`tab-item ${category === 'myCars' ? 'active' : ''}`}>My Cars</div>
						</Link>
					</>
				)}
				<Link href={{ pathname: '/mypage', query: { category: 'myFavorites' } }} scroll={false}>
					<div className={`tab-item ${category === 'myFavorites' ? 'active' : ''}`}>Favorites</div>
				</Link>
				<Link href={{ pathname: '/mypage', query: { category: 'recentlyVisited' } }} scroll={false}>
					<div className={`tab-item ${category === 'recentlyVisited' ? 'active' : ''}`}>Visited</div>
				</Link>
				<Link href={{ pathname: '/mypage', query: { category: 'myArticles' } }} scroll={false}>
					<div className={`tab-item ${category === 'myArticles' ? 'active' : ''}`}>Articles</div>
				</Link>
				<Link href={{ pathname: '/mypage', query: { category: 'writeArticle' } }} scroll={false}>
					<div className={`tab-item ${category === 'writeArticle' ? 'active' : ''}`}>Write Article</div>
				</Link>
				<Link href={{ pathname: '/mypage', query: { category: 'followers' } }} scroll={false}>
					<div className={`tab-item ${category === 'followers' ? 'active' : ''}`}>My Followers</div>
				</Link>
				<Link href={{ pathname: '/mypage', query: { category: 'followings' } }} scroll={false}>
					<div className={`tab-item ${category === 'followings' ? 'active' : ''}`}>My Followings</div>
				</Link>
				<Link href={{ pathname: '/mypage', query: { category: 'myProfile' } }} scroll={false}>
					<div className={`tab-item ${category === 'myProfile' ? 'active' : ''}`}>Account settings</div>
				</Link>
			</div>
		</Stack>
	);
};

export default MyMenu;