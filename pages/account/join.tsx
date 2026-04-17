import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { signIn } from 'next-auth/react';

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
							<img src="/img/logo/mans_logo.jpg" alt="" style={{ borderRadius: '50%'}} />
							<span>mansury</span>
						</Box>

						<Box className={'info'}>
							<span>{loginView ? 'Welcome back.' : 'Join Mansory.'}</span>
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

							{/* Divider */}
<Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 2, 
    margin: '16px 0' 
}}>
    <Box sx={{ flex: 1, height: '0.5px', background: '#2a2a2a' }} />
    <span style={{ fontSize: '11px', color: '#444', letterSpacing: '1px' }}>OR</span>
    <Box sx={{ flex: 1, height: '0.5px', background: '#2a2a2a' }} />
</Box>

{/* Google Button */}
<button
    className={'google-btn'}
    onClick={() => signIn('google', { callbackUrl: '/' })}
>
    <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
    <span>Continue with Google</span>
</button>
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