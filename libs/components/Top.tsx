import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { alpha, styled } from '@mui/material/styles';
import Menu, { MenuProps } from '@mui/material/Menu';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { Logout } from '@mui/icons-material';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
	const [lang, setLang] = useState<string | null>('en');
	const drop = Boolean(anchorEl2);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	let open = Boolean(anchorEl);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const logoutOpen = Boolean(logoutAnchor);
	const [notifOpen, setNotifOpen] = useState(false);

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'en');
			setLang('en');
		} else {
			setLang(localStorage.getItem('locale'));
		}
	}, [router]);

	useEffect(() => {
		switch (router.pathname) {
			case '/car/detail':
				setBgColor(true);
				break;
			default:
				break;
		}
	}, [router]);

	useEffect(() => {
		const jwt = getJwtToken();
		if (jwt) updateUserInfo(jwt);
	}, []);

	// useEffect ga qo'shing
useEffect(() => {
  const handleClickOutside = () => setNotifOpen(false);
  if (notifOpen) document.addEventListener('click', handleClickOutside);
  return () => document.removeEventListener('click', handleClickOutside);
}, [notifOpen]);

	/** HANDLERS **/

	



	const langClick = (e: any) => {
		setAnchorEl2(e.currentTarget);
	};

	const langClose = () => {
		setAnchorEl2(null);
	};

	const langChoice = useCallback(
		async (e: any) => {
			setLang(e.target.id);
			localStorage.setItem('locale', e.target.id);
			setAnchorEl2(null);
			await router.push(router.asPath, router.asPath, { locale: e.target.id });
		},
		[router],
	);

	const changeNavbarColor = () => {
		if (window.scrollY >= 50) {
			setColorChange(true);
		} else {
			setColorChange(false);
		}
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleHover = (event: any) => {
		if (anchorEl !== event.currentTarget) {
			setAnchorEl(event.currentTarget);
		} else {
			setAnchorEl(null);
		}
	};

	const StyledMenu = styled((props: MenuProps) => (
		<Menu
			elevation={0}
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			{...props}
		/>
	))(({ theme }) => ({
		'& .MuiPaper-root': {
			top: '109px',
			borderRadius: 6,
			marginTop: theme.spacing(1),
			minWidth: 160,
			color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
			boxShadow:
				'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
			'& .MuiMenu-list': {
				padding: '4px 0',
			},
			'& .MuiMenuItem-root': {
				'& .MuiSvgIcon-root': {
					fontSize: 18,
					color: theme.palette.text.secondary,
					marginRight: theme.spacing(1.5),
				},
				'&:active': {
					backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
				},
			},
		},
	}));

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}>
					<div>{t('Home')}</div>
				</Link>
				<Link href={'/car'}>
					<div>{t('Cars')}</div>
				</Link>
				<Link href={'/agent'}>
					<div> {t('Agents')} </div>
				</Link>
				<Link href={'/community?articleCategory=FREE'}>
					<div> {t('Community')} </div>
				</Link>
				<Link href={'/cs'}>
					<div> {t('CS')} </div>
				</Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>


						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}>
								<img src="/img/logo/mansury.png" alt="" />
							</Link>
						</Box>


						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}>
								<div className={router.pathname === '/' ? 'active' : ''}
								>{t('Home')}</div>
							</Link>
							<Link href={'/car'}>
								<div className={router.pathname === '/car' ? 'active' : ''}
								>{t('Cars')}</div>
							</Link>
							<Link href={'/agent'}>
								<div className={router.pathname === '/agent' ? 'active' : ''}
								> {t('Dealers')} </div>
							</Link>
							<Link href={'/community?articleCategory=FREE'}>
								<div className={router.pathname === '/community' ? 'active' : ''}
								> {t('Blog')} </div>
							</Link>
							<Link href={'/about'}>
								<div className={router.pathname === '/about' ? 'active' : ''}
								> {t('About')} </div>
							</Link>
							{/* {user?._id && (
								<Link href={'/mypage'}>
									<div> {t('My Page')} </div>
								</Link>
							)} */}
							<Link href={'/cs'}>
								<div className={router.pathname === '/cs' ? 'active' : ''}
								> {t('CS')} </div>
							</Link>
						</Box>

						<Box component={'div'} className={'user-box'}>
							
							{user?._id ? (

								<>
								<Link href={'/mypage'}>
								<div>
									<div 
									style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', color: '#fff' }}
									className={'login-user'} onClick={(event: any) => setLogoutAnchor(event.currentTarget)}>
										<img
											src={
												user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'
											}
											alt=""
										/>
										<span>{user?.memberNick}</span>
									</div>
								</div>
								</Link>
									
								</>


							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										{/* <AccountCircleOutlinedIcon /> */}
										<span>
											{t('Login')} / {t('Register')}
										</span>
									</div>
								</Link>
							)}

							<div className={'lan-box'}>

{user?._id && (
  <div style={{ position: 'relative' }}>
    <NotificationsOutlinedIcon 
      className={'notification-icon'} 
      style={{ cursor: 'pointer' }}
      onClick={(e: any) => {
        e.stopPropagation();
        setNotifOpen(!notifOpen);
      }}
    />
    
    {notifOpen && (
  <div 
    onClick={(e) => e.stopPropagation()}
    style={{
      position: 'absolute',
      top: '40px',
      right: '-20px',
      width: '320px',
      background: '#fff',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      zIndex: 1000,
      padding: '16px',
    }}>
    <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>
      Notifications
    </h3>
    
    {[].length === 0 ? (
      <div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>
        No notifications yet
      </div>
    ) : (
      [].map((notif: any, i: number) => (
        <div key={i} style={{
          padding: '10px 0',
          borderBottom: '1px solid #f0f0f0',
          fontSize: '14px',
          color: '#333'
        }}>
          <div>{notif.text}</div>
          <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>{notif.time}</div>
        </div>
      ))
    )}
  </div>
)}
</div>
)}

								<Button
									disableRipple
									className="btn-lang"
									onClick={langClick}
									endIcon={<CaretDown size={14} color="#616161" weight="fill" />}

								>
									Language
									{/* <Box component={'div'} className={'flag'}>
										{lang !== null ? (
											<img src={`/img/flag/lang${lang}.png`} alt={'Language'} />
										) : (
											<img src={`/img/flag/langen.png`} alt={'Language'} />
										)}
									</Box> */}
								</Button>

								<StyledMenu anchorEl={anchorEl2} open={drop} onClose={langClose} sx={{ position: 'absolute' }}>
									<MenuItem disableRipple onClick={langChoice} id="en">
										{/* <img
											className="img-flag"
											src={'/img/flag/langen.png'}
											onClick={langChoice}
											id="en"
											alt={'usaFlag'}
										/> */}
										{t('English')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="kr">
										{/* <img
											className="img-flag"
											src={'/img/flag/langkr.png'}
											onClick={langChoice}
											id="uz"
											alt={'koreanFlag'}
										/> */}
										{t('Korean')}
									</MenuItem>
									<MenuItem disableRipple onClick={langChoice} id="ru">
										{/* <img
											className="img-flag"
											src={'/img/flag/langru.png'}
											onClick={langChoice}
											id="ru"
											alt={'russiaFlag'}
										/> */}
										{t('Russian')}
									</MenuItem>
								</StyledMenu>
							</div>
						</Box>


						
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);
