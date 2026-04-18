import React, { useCallback, useEffect, useRef } from 'react';
import { useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { getJwtToken, logOut, updateUserInfo } from '../auth';
import { Stack, Box } from '@mui/material';
import { CaretDown } from 'phosphor-react';
import useDeviceDetect from '../hooks/useDeviceDetect';
import Link from 'next/link';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../config';

const Top = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const [lang, setLang] = useState<string | null>('en');
	const [drop, setDrop] = useState(false);
	const [colorChange, setColorChange] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<any | HTMLElement>(null);
	const [bgColor, setBgColor] = useState<boolean>(false);
	const [logoutAnchor, setLogoutAnchor] = React.useState<null | HTMLElement>(null);
	const [notifOpen, setNotifOpen] = useState(false);

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

	useEffect(() => {
		const handleClickOutside = () => {
			setNotifOpen(false);
			setDrop(false);
		};
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	}, []);

	const langChoice = useCallback(
		async (id: string) => {
			setLang(id);
			localStorage.setItem('locale', id);
			setDrop(false);
			await router.push(router.asPath, router.asPath, { locale: id });
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

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', changeNavbarColor);
	}

	if (device == 'mobile') {
		return (
			<Stack className={'top'}>
				<Link href={'/'}><div>{t('Home')}</div></Link>
				<Link href={'/car'}><div>{t('Cars')}</div></Link>
				<Link href={'/agent'}><div> {t('Agents')} </div></Link>
				<Link href={'/community?articleCategory=FREE'}><div> {t('Community')} </div></Link>
				<Link href={'/cs'}><div> {t('CS')} </div></Link>
			</Stack>
		);
	} else {
		return (
			<Stack className={'navbar'}>
				<Stack className={`navbar-main ${colorChange ? 'transparent' : ''} ${bgColor ? 'transparent' : ''}`}>
					<Stack className={'container'}>

						<Box component={'div'} className={'logo-box'}>
							<Link href={'/'}><img src="/img/logo/mansury.png" alt="" /></Link>
						</Box>

						<Box component={'div'} className={'router-box'}>
							<Link href={'/'}><div className={router.pathname === '/' ? 'active' : ''}>{t('Home')}</div></Link>
							<Link href={'/car'}><div className={router.pathname === '/car' ? 'active' : ''}>{t('Cars')}</div></Link>
							<Link href={'/agent'}><div className={router.pathname === '/agent' ? 'active' : ''}> {t('Dealers')} </div></Link>
							<Link href={'/community?articleCategory=FREE'}><div className={router.pathname === '/community' ? 'active' : ''}> {t('Blog')} </div></Link>
							<Link href={'/about'}><div className={router.pathname === '/about' ? 'active' : ''}> {t('About')} </div></Link>
							<Link href={'/cs'}><div className={router.pathname === '/cs' ? 'active' : ''}> {t('CS')} </div></Link>
						</Box>

						<Box component={'div'} className={'user-box'}>
							{user?._id ? (
								<Link href={'/mypage'}>
									<div>
										<div
											style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '8px', color: '#fff' }}
											className={'login-user'}
											onClick={(event: any) => setLogoutAnchor(event.currentTarget)}
										>
											<img
												src={user?.memberImage ? `${REACT_APP_API_URL}/${user?.memberImage}` : '/img/profile/defaultUser.svg'}
												alt=""
											/>
											<span>{user?.memberNick}</span>
										</div>
									</div>
								</Link>
							) : (
								<Link href={'/account/join'}>
									<div className={'join-box'}>
										<span>{t('Login')} / {t('Register')}</span>
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
												}}
											>
												<h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600 }}>Notifications</h3>
												<div style={{ textAlign: 'center', color: '#999', padding: '20px 0' }}>No notifications yet</div>
											</div>
										)}
									</div>
								)}

								<div
									style={{ position: 'relative' }}
									onClick={(e) => e.stopPropagation()}
								>
									<button
										className="btn-lang"
										onClick={() => setDrop(!drop)}
									>
										{lang?.toUpperCase() || 'EN'}
										<CaretDown size={10} color="rgba(201,168,76,0.6)" weight="fill" />
									</button>

									{drop && (
										<div style={{
											position: 'absolute',
											top: 'calc(100% + 8px)',
											right: 0,
											minWidth: '150px',
											background: '#0f0f0f',
											border: '1px solid rgba(180,150,90,0.2)',
											borderTop: '1px solid #c9a84c',
											zIndex: 9999,
										}}>
											{[
												
												{ id: 'en', label: t('English') },
												{ id: 'kr', label: t('Korean') },
												{ id: 'ru', label: t('Russian') },
											].map((item) => (
												<div
													key={item.id}
													onClick={() => langChoice(item.id)}
													style={{
														padding: '14px 20px',
														fontFamily: 'Montserrat, sans-serif',
														fontSize: '11px',
														letterSpacing: '1.8px',
														textTransform: 'uppercase',
														color: 'rgba(255,255,255,0.65)',
														borderBottom: '1px solid rgba(255,255,255,0.04)',
														cursor: 'pointer',
													}}
													onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
													onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
												>
													{item.label}
												</div>
											))}
										</div>
									)}
								</div>
							</div>
						</Box>

					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withRouter(Top);