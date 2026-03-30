import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Stack, Box, Link } from '@mui/material';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';


const Footer = () => {
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');

	if (device == 'mobile') {
		return (
			<Stack className={'footer-container'}>
				{/* Footer Top Section */}
				<Stack className={'footer-top'}>
					<Stack className={'top-content'}>
						<Box className={'logo-section'}>
							<img src="/img/logo/mansury.png" alt="" className={'logo'} />
							<p>Leading the future of automotive excellence with cutting-edge technology and premium services.</p>
						</Box>

						<Box className={'newsletter-section'}>
							<h4>Stay Updated</h4>
							<p>Get the latest news and offers from Mansury</p>
							<div className={'email-input'}>
								<input type="email" placeholder="your@email.com" />
								<button>Subscribe</button>
							</div>
						</Box>
					</Stack>
				</Stack>

				{/* Footer Main Section */}
				<Stack className={'footer-main'}>
					<Stack className={'links-grid'}>
						<Box className={'link-column'}>
							<h4>Quick Links</h4>
							<Link component={NextLink} href="/">Home</Link>
							<a href="/about">About Us</a>
							<a href="/cars">Browse Cars</a>
							<a href="/sellers">Sellers</a>
						</Box>
						<Box className={'link-column'}>
							<h4>Company</h4>
							<a href="/about">About Mansury</a>
							<a href="/careers">Careers</a>
							<a href="/press">Press</a>
							<a href="/blog">Blog</a>
						</Box>
						<Box className={'link-column'}>
							<h4>Support</h4>
							<a href="/contact">Contact Us</a>
							<a href="/faq">FAQ</a>
							<a href="/help">Help Center</a>
							<a href="/terms">Terms of Service</a>
						</Box>
						<Box className={'link-column'}>
							<h4>Contact</h4>
							<a href="tel:+821024995115">+82 10 2499 5115</a>
							<a href="mailto:support@mansury.com">support@mansury.com</a>
							<a href="/contact">Seoul, South Korea</a>
						</Box>
					</Stack>
				</Stack>

				{/* Footer Bottom Section */}
				<Stack className={'footer-bottom'}>
					<Box className={'social-icons'}>
							{
								[{
									href: '#',
									Icon: FacebookOutlinedIcon,
								}, {
									href: '#',
									Icon: InstagramIcon,
								}, {
									href: '#',
									Icon: TelegramIcon,
								}, {
									href: '#',
									Icon: TwitterIcon,
								}].map((item, idx) => (
									<a key={idx} href={item.href}>
										<item.Icon />
									</a>
								))
							}
					</Box>
					<span>© {moment().year()} Mansury. All rights reserved.</span>
					<Box className={'footer-links'}>
						<a href="#">Privacy Policy</a>
						<span>·</span>
						<a href="#">Terms of Service</a>
						<span>·</span>
						<a href="#">Cookie Policy</a>
					</Box>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'footer-container'}>
				{/* Footer Top Section */}
				<Stack className={'footer-top'}>
					<Stack className={'top-content'}>
						<Box className={'logo-section'}>
							<img src="/img/logo/mansury.png" alt="Mansury Logo" className={'logo'} style={{ width: '250px', height: '190px'}}  />
							<p>Leading the future of automotive excellence with cutting-edge technology and premium services.</p>
							{/* @ts-ignore: simplify child union complexity */}
						<Box className={'social-icons'}>
								<a href="https://www.facebook.com/mansory?locale=ru_RU"  target="_blank" rel="noopener noreferrer"><FacebookOutlinedIcon /></a>
								<a href="https://www.instagram.com/mansory/"  target="_blank" rel="noopener noreferrer"><InstagramIcon /></a>
								<a href="#"  target="_blank" rel="noopener noreferrer"><TelegramIcon /></a>
								<a href="https://twitter.com/mansory"  target="_blank" rel="noopener noreferrer"><TwitterIcon /></a>
							</Box>
						</Box>

						<Box className={'newsletter-section'}>
							<h4>Stay Updated</h4>
							<p>Get the latest news, offers, and updates directly to your inbox</p>
							<div className={'email-input'}>
								<input type="email" placeholder="your@email.com" />
								<button>Subscribe</button>
							</div>
						</Box>

						<Box className={'contact-section'}>
							<h4>Contact Info</h4>
							<Box className={'contact-item'}>
								<PhoneIcon />
								<div>
									<span>Phone</span>
									<p>+82 10 2499 5115</p>
								</div>
							</Box>
							<Box className={'contact-item'}>
								<EmailIcon />
								<div>
									<span>Email</span>
									<p>support@mansury.com</p>
								</div>
							</Box>
							<Box className={'contact-item'}>
								<LocationOnIcon />
								<div>
									<span>Location</span>
									<p>Seoul, South Korea</p>
								</div>
							</Box>
						</Box>
					</Stack>
				</Stack>

				{/* Footer Main Section */}
				<Stack className={'footer-main'}>
					<Stack className={'links-grid'}>
						<Box className={'link-column'}>
							<h4>Quick Links</h4>
							<a href="/">Home</a>
							<a href="/car">Cars</a>
							<a href="/agent">Dealers</a>
							<a href="/community">Community</a>
							<a href="/about">About</a>
						</Box>
						<Box className={'link-column'}>
							<h4>Company</h4>
							<a href="#">About Mansury</a>
							<a href="#">Careers</a>
							<a href="#">Press Release</a>
							<a href="#">Blog</a>
							<a href="#">Partnership</a>
						</Box>
						<Box className={'link-column'}>
							<h4>Support</h4>
							<a href="#">Contact Support</a>
							<a href="#">FAQ</a>
							<a href="#">Help Center</a>
							<a href="#">Feedback</a>
							<a href="#">Report Issue</a>
						</Box>
						<Box className={'link-column'}>
							<h4>Legal</h4>
							<a href="#">Terms of Service</a>
							<a href="#">Privacy Policy</a>
							<a href="#">Cookie Policy</a>
							<a href="#">Disclaimer</a>
							<a href="#">Sitemap</a>
						</Box>
					</Stack>
				</Stack>

				{/* Footer Bottom Section */}
				<Stack className={'footer-bottom'}>
					<span>© {moment().year()} Mansury. All rights reserved. Designed with ❤️ for car enthusiasts.</span>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
