import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const router = useRouter();
	const device = useDeviceDetect();
	const [input, setInput] = useState({ nick: '', password: '', phone: '', type: 'USER' });
	const [loginView, setLoginView] = useState<boolean>(true);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	/** HANDLERS **/
	const viewChangeHandler = (state: boolean) => {
		setLoginView(state);
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	const doLogin = useCallback(async () => {
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const doSignUp = useCallback(async () => {
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	if (device === 'mobile') {
		return <div>LOGIN MOBILE</div>;
	}

	return (
		<Stack className={'join-page'}>
			<Stack className={'container'}>
				<Stack className={'main'}>
					<Stack className={'left'}>

						<Box className={'logo'}>
							<img src="/img/logo/logoText.svg" alt="" />
							<span>mansory</span>
						</Box>

						<Box className={'info'}>
							<span>{loginView ? 'Welcome back.' : 'Join Mansury.'}</span>
							<p>{loginView ? 'Sign in to access your premium account' : 'Create your account and start exploring'}</p>
						</Box>

						<Box className={'tabs'}>
							<button
								className={`tab ${loginView ? 'active' : ''}`}
								onClick={() => viewChangeHandler(true)}
							>
								Login
							</button>
							<button
								className={`tab ${!loginView ? 'active' : ''}`}
								onClick={() => viewChangeHandler(false)}
							>
								Sign up
							</button>
						</Box>

						<Box className={'input-wrap'}>
							<div className={'input-box'}>
								<span>Nickname</span>
								<input
									type="text"
									placeholder={'Enter your nickname'}
									onChange={(e) => handleInput('nick', e.target.value)}
									required={true}
									onKeyDown={(e) => {
										if (e.key === 'Enter' && loginView) doLogin();
										if (e.key === 'Enter' && !loginView) doSignUp();
									}}
								/>
							</div>
							<div className={'input-box'}>
    <span>Password</span>
    <div className={'input-eye-wrap'}>
        <input
            type={showPassword ? 'text' : 'password'}
            placeholder={'••••••••'}
            onChange={(e) => handleInput('password', e.target.value)}
            required={true}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && loginView) doLogin();
                if (e.key === 'Enter' && !loginView) doSignUp();
            }}
        />
        <span className={'eye-icon'} onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            )}
        </span>
    </div>
</div>
							{!loginView && (
								<div className={'input-box'}>
									<span>Phone</span>
									<input
										type="text"
										placeholder={'+998 -- --- -- --'}
										onChange={(e) => handleInput('phone', e.target.value)}
										required={true}
										onKeyDown={(e) => {
											if (e.key === 'Enter') doSignUp();
										}}
									/>
								</div>
							)}
						</Box>

						<Box className={'register'}>
							{!loginView && (
								<div className={'type-option'}>
									<button
										className={`type-btn ${input.type === 'USER' ? 'selected' : ''}`}
										onClick={() => handleInput('type', 'USER')}
									>
										User
									</button>
									<button
										className={`type-btn ${input.type === 'AGENT' ? 'selected' : ''}`}
										onClick={() => handleInput('type', 'AGENT')}
									>
										Agent
									</button>
								</div>
							)}

							{loginView && (
								<div className={'remember-info'}>
									<FormGroup>
										<FormControlLabel
											control={<Checkbox defaultChecked size="small" />}
											label="Remember me"
										/>
									</FormGroup>
									<a>Lost your password?</a>
								</div>
							)}

							{loginView ? (
								<Button
									variant="contained"
									className={'submit-btn'}
									disabled={input.nick === '' || input.password === ''}
									onClick={doLogin}
								>
									Sign In
								</Button>
							) : (
								<Button
									variant="contained"
									className={'submit-btn'}
									disabled={
										input.nick === '' ||
										input.password === '' ||
										input.phone === '' ||
										input.type === ''
									}
									onClick={doSignUp}
								>
									Create Account
								</Button>
							)}
						</Box>

						<Box className={'ask-info'}>
							{loginView ? (
								<p>
									Not registered yet?
									<b onClick={() => viewChangeHandler(false)}>Sign up</b>
								</p>
							) : (
								<p>
									Have an account?
									<b onClick={() => viewChangeHandler(true)}>Login</b>
								</p>
							)}
						</Box>
					</Stack>

					<Stack className={'right'}>
    <div className={'right-grid'}></div>
    <div className={'right-content'}>
        <span className={'right-label'}>Premium Platform</span>
        <h2 className={'right-heading'}>
            Drive<br />your<br /><span>dream.</span>
        </h2>
        <p className={'right-desc'}>
            Access thousands of premium vehicles from verified agents across the country.
        </p>
        <svg className={'car-svg'} viewBox="0 0 340 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="170" cy="148" rx="130" ry="8" fill="rgba(143,169,192,0.06)" />
            <path d="M60 110 Q80 70 110 60 L140 52 Q165 44 200 44 Q230 44 255 55 L285 70 Q305 80 310 100 L315 110 L60 110Z" fill="#1a1e24" stroke="#2a2e34" strokeWidth="1" />
            <path d="M110 60 L125 35 Q135 22 155 20 L200 20 Q218 20 228 30 L255 55" fill="#151920" stroke="#2a2e34" strokeWidth="1" />
            <path d="M128 58 L140 30 L220 30 L248 58Z" fill="rgba(143,169,192,0.06)" stroke="rgba(143,169,192,0.1)" strokeWidth="0.5" />
            <line x1="184" y1="22" x2="184" y2="58" stroke="rgba(143,169,192,0.08)" strokeWidth="1" />
            <rect x="60" y="104" width="255" height="12" rx="3" fill="#111418" />
            <circle cx="108" cy="118" r="18" fill="#111" stroke="#2a2e34" strokeWidth="1.5" />
            <circle cx="108" cy="118" r="10" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
            <circle cx="108" cy="118" r="4" fill="#8fa9c0" fillOpacity="0.4" />
            <circle cx="245" cy="118" r="18" fill="#111" stroke="#2a2e34" strokeWidth="1.5" />
            <circle cx="245" cy="118" r="10" fill="#0a0a0a" stroke="#333" strokeWidth="1" />
            <circle cx="245" cy="118" r="4" fill="#8fa9c0" fillOpacity="0.4" />
            <rect x="62" y="82" width="40" height="18" rx="3" fill="rgba(143,169,192,0.15)" stroke="rgba(143,169,192,0.2)" strokeWidth="0.5" />
            <rect x="108" y="82" width="8" height="18" rx="1" fill="#8fa9c0" fillOpacity="0.6" />
            <rect x="255" y="84" width="40" height="16" rx="3" fill="rgba(143,169,192,0.08)" stroke="rgba(143,169,192,0.15)" strokeWidth="0.5" />
            <rect x="248" y="84" width="8" height="16" rx="1" fill="#8fa9c0" fillOpacity="0.4" />
        </svg>
        <div className={'car-badge'}>
            <div className={'badge-dot'}></div>
            <span>Premium Access</span>
        </div>
        <p className={'right-watermark'}>M</p>
    </div>
</Stack>



				</Stack>
			</Stack>
		</Stack>
	);
};

export default withLayoutBasic(Join);