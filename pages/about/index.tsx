import React from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box } from '@mui/material';

const About: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return <div>ABOUT PAGE MOBILE</div>;
	} else {
		return (
			<Stack className={'about-page'}>
				{/* Hero Section */}
				<Stack className={'hero-section'}>
					<Stack className={'container'}>
						<Box className={'hero-content'}>
							<span className={'badge'}>About Mansury</span>
							<h1>Leading the Future of Automotive Excellence</h1>
							<p>We revolutionize the way people discover, buy, and sell vehicles through cutting-edge technology and unparalleled customer service.</p>
						</Box>
					</Stack>
				</Stack>

				{/* Mission Vision Section */}
				<Stack className={'mission-section'}>
					<Stack className={'container'}>
						<Box className={'mission-box'}>
							<h2>Our Mission</h2>
							<p>To empower millions of customers worldwide by providing transparent, secure, and innovative automotive solutions that transform the buying and selling experience.</p>
							<div className={'highlight'}>Connecting dreams with cars</div>
						</Box>
						<Box className={'vision-box'}>
							<h2>Our Vision</h2>
							<p>To be the world's most trusted and innovative automotive marketplace, where every transaction is seamless, secure, and customer-centric.</p>
							<div className={'highlight'}>Building tomorrow's marketplace</div>
						</Box>
					</Stack>
				</Stack>

				{/* Why Choose Us */}
				<Stack className={'why-choose-section'}>
					<Stack className={'container'}>
						<Box className={'section-header'}>
							<h2>Why Choose Mansury?</h2>
							<p>We set ourselves apart through innovation, integrity, and unwavering commitment to excellence.</p>
						</Box>
						<Stack className={'features-grid'}>
							<Box className={'feature-card'}>
								<div className={'icon'}>
									<img src="/img/icons/security.svg" alt="Trust" />
								</div>
								<h3>Verified Listings</h3>
								<p>Every vehicle is thoroughly inspected and verified to ensure quality and authenticity.</p>
							</Box>
							<Box className={'feature-card'}>
								<div className={'icon'}>
									<img src="/img/icons/keywording.svg" alt="Transparency" />
								</div>
								<h3>Complete Transparency</h3>
								<p>Full vehicle history, pricing details, and documentation available upfront.</p>
							</Box>
							<Box className={'feature-card'}>
								<div className={'icon'}>
									<img src="/img/icons/investment.svg" alt="Support" />
								</div>
								<h3>24/7 Expert Support</h3>
								<p>Our dedicated team is always ready to assist you throughout your buying journey.</p>
							</Box>
							<Box className={'feature-card'}>
								<div className={'icon'}>
									<img src="/img/icons/garden.svg" alt="Security" />
								</div>
								<h3>Secure Transactions</h3>
								<p>Bank-level encryption and secure payment methods to protect your investments.</p>
							</Box>
							<Box className={'feature-card'}>
								<div className={'icon'}>
									<img src="/img/icons/securePayment.svg" alt="Speed" />
								</div>
								<h3>Fast Delivery</h3>
								<p>Streamlined processes ensure quick and hassle-free vehicle delivery to your doorstep.</p>
							</Box>
							<Box className={'feature-card'}>
								<div className={'icon'}>
									<img src="/img/icons/security.svg" alt="Community" />
								</div>
								<h3>Community First</h3>
								<p>Join thousands of satisfied customers in our growing automotive community.</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* Statistics Section */}
				<Stack className={'achievements-section'}>
					<Stack className={'container'}>
						<Box className={'stats-wrapper'}>
							<Box className={'stat-card'}>
								<strong>250K+</strong>
								<p>Active Listings</p>
								<span className={'subtext'}>Constantly updated inventory</span>
							</Box>
							<Box className={'stat-card'}>
								<strong>1.2M+</strong>
								<p>Happy Customers</p>
								<span className={'subtext'}>Trusted by millions worldwide</span>
							</Box>
							<Box className={'stat-card'}>
								<strong>50+</strong>
								<p>Countries Served</p>
								<span className={'subtext'}>Global reach, local expertise</span>
							</Box>
							<Box className={'stat-card'}>
								<strong>99.8%</strong>
								<p>Satisfaction Rate</p>
								<span className={'subtext'}>Industry-leading customer satisfaction</span>
							</Box>
						</Box>
					</Stack>
				</Stack>

				{/* Core Values Section */}
				<Stack className={'values-section'}>
					<Stack className={'container'}>
						<Box className={'section-header'}>
							<h2>Our Core Values</h2>
							<p>These principles guide everything we do and shape our corporate culture.</p>
						</Box>
						<Stack className={'values-grid'}>
							<Box className={'value-card'}>
								<h3>Integrity</h3>
								<p>We operate with complete honesty and transparency in every transaction.</p>
							</Box>
							<Box className={'value-card'}>
								<h3>Innovation</h3>
								<p>Continuously pushing boundaries to deliver cutting-edge solutions.</p>
							</Box>
							<Box className={'value-card'}>
								<h3>Customer Focus</h3>
								<p>Your satisfaction is our ultimate measure of success.</p>
							</Box>
							<Box className={'value-card'}>
								<h3>Sustainability</h3>
								<p>Committed to environmental responsibility in all operations.</p>
							</Box>
						</Stack>
					</Stack>
				</Stack>

				{/* Team Section */}
				<Stack className={'team-section'}>
					<Stack className={'container'}>
						<Box className={'section-header'}>
							<h2>Our Leadership Team</h2>
							<p>Experienced professionals dedicated to your success.</p>
						</Box>
						<Stack className={'team-grid'}>
							{/* Team members will be rendered here */}
						</Stack>
					</Stack>
				</Stack>

				{/* CTA Section */}
				<Stack className={'cta-section'}>
					<Stack className={'container'}>
						<h2>Ready to Find Your Perfect Vehicle?</h2>
						<p>Join thousands of satisfied customers who've discovered their ideal cars on Mansury.</p>
						<Stack className={'cta-buttons'}>
							<button className={'btn-primary'}>
								Browse Vehicles
								<img src="/img/icons/rightup.svg" alt="" />
							</button>
							<button className={'btn-secondary'}>
								Get Expert Advice
								<img src="/img/icons/rightup.svg" alt="" />
							</button>
						</Stack>
					</Stack>
				</Stack>

				{/* Contact Section */}
				<Stack className={'contact-section'}>
					<Stack className={'container'}>
						<Box className={'contact-left'}>
							<h3>Get in Touch</h3>
							<p>Have questions? Our expert team is here to help you 24/7.</p>
						</Box>
						<Box className={'contact-right'}>
							<div className={'contact-method'}>
								<img src="/img/icons/call.svg" alt="" />
								<div>
									<span>Call Us</span>
									<p>+1 (920) 851-9087</p>
								</div>
							</div>
							<div className={'contact-method'}>
								<img src="/img/icons/rightup.svg" alt="" />
								<div>
									<span>Email Us</span>
									<p>support@mansury.com</p>
								</div>
							</div>
						</Box>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(About);
