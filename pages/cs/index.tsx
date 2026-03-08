import React from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Box, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Notice from '../../libs/components/cs/Notice';
import Faq from '../../libs/components/cs/Faq';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CS: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	const changeTabHandler = (tab: string) => {
		router.push({ pathname: '/cs', query: { tab } }, undefined, { scroll: false });
	};

	const tab = router.query.tab ?? 'notice';

	if (device === 'mobile') {
		return <h1>CS PAGE MOBILE</h1>;
	} else {
		return (
			<Stack className={'cs-page'} style={{ background: 'linear-gradient(180deg, #0a1a1a 0%, #0d1f1f 100%)', minHeight: '100vh' }}>
				<Stack className={'container'}>
					<Box component={'div'} className={'cs-main-info'}>
						<Box component={'div'} className={'info'}>
							<div className={'info-badge'}>Support</div>
							<span>CS Center</span>
							<p>We're here to help you with anything you need</p>
						</Box>
						<Box component={'div'} className={'btns'}>
							<div
								className={tab == 'notice' ? 'active' : ''}
								onClick={() => changeTabHandler('notice')}
							>
								<span className="tab-icon">📢</span> Notice
							</div>
							<div
								className={tab == 'faq' ? 'active' : ''}
								onClick={() => changeTabHandler('faq')}
							>
								<span className="tab-icon">💬</span> FAQ
							</div>
						</Box>
					</Box>

					<Box component={'div'} className={'cs-content'}>
						{tab === 'notice' && <Notice />}
						{tab === 'faq' && <Faq />}
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(CS);