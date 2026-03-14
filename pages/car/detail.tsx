import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button,  CircularProgress, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/car/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import CarBigCard from '../../libs/components/common/CarBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Car } from '../../libs/types/car/car';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { GET_COMMENTS, GET_CARS, GET_CAR } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CREATE_COMMENT, LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
 import { useRef } from 'react';
import CarCardDP from '../../libs/components/common/CarCardDP';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CarDetail: NextPage = ({ initialComment, ...props }: any) => {
	const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
	const lightboxSwiperRef = useRef<any>(null);
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [carId, setCarId] = useState<string | null>(null);
	const [car, setCar] = useState<Car | null>(null);
	const [slideImage, setSlideImage] = useState<string>('');
	const [destinationCars, setDestinationCars] = useState<Car[]>([]);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
	const [carComments, setCarComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.CAR,
		commentContent: '',
		commentRefId: '',
	});

	/** APOLLO REQUESTS **/
	const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
	// const [createComment] = useMutation(CREATE_COMMENT);
	const [createComment] = useMutation(CREATE_COMMENT, {
  onCompleted: () => {
    getCommetnsRefetch(); // ✅ to‘g‘ri joy
  },
});


		const {
	  loading: getCarLoading,
	  data: getCarData,
	  error: getCarError,
	  refetch: getCarRefetch,
	} = useQuery(GET_CAR, {
	  fetchPolicy: 'network-only',
	  variables: { input: carId },
	  skip: !carId,
	  notifyOnNetworkStatusChange: true,
	  onCompleted: (data: T) => {
		if (data?.getCar) setCar(data?.getCar);
		if (data?.getCar) setSlideImage(data?.getCar?.carImages[0]);
	  },
	});



	const {
  loading: getCarsLoading,
  data: getCarsData,
  error: getCarsError,
  refetch: getCarsRefetch,
} = useQuery(GET_CARS, {
  fetchPolicy: 'cache-and-network',
  variables: {
    input: {
      page: 1,
      limit: 4,
      sort: 'createdAt',
      direction: Direction.DESC,
      search: {
        locationList: car?.carLocation ? [car?.carLocation] : [],
      },
    },
  },
  skip: !carId && !car,
  notifyOnNetworkStatusChange: true,
  onCompleted: (data: T) => {
    if (data?.getCars?.list) setDestinationCars(data?.getCars?.list);
  },
});


	const {
  loading: getCommentsLoading,
  data: getCommentsData,
  error: getCommentsError,
  refetch: getCommetnsRefetch,
} = useQuery(GET_COMMENTS, {
  fetchPolicy: 'cache-and-network',
  variables: { input: initialComment },
  skip: !commentInquiry.search.commentRefId,
  notifyOnNetworkStatusChange: true,
  onCompleted: (data: T) => {
    if (data?.getComments?.list) setCarComments(data?.getComments?.list);
	setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
  },
});



	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setCarId(router.query.id as string);
			setCommentInquiry({
				...commentInquiry,
				search: {
					commentRefId: router.query.id as string,
				},
			});
			setInsertCommentData({
				...insertCommentData,
				commentRefId: router.query.id as string,
			});
		}
	}, [router]);

	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
            getCommetnsRefetch({ input: commentInquiry });
		}
		
	}, [commentInquiry]);

	/** HANDLERS **/
	const changeImageHandler = (image: string) => {
		setSlideImage(image);
	};

		const likeCarHandler = async (user: T, id: string) => {
	  try {
		if (!id) return;
		if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
	
		await likeTargetCar({
		  variables: { input: id },
		});
		await getCarRefetch({ input: id });
		await getCarsRefetch({ 
			input: {
               page: 1,
               limit: 4,
               sort: 'createdAt',
               direction: Direction.DESC,
               search: {
                locationList: [car?.carLocation],
		        },
	         },
	     });
	
		await sweetTopSmallSuccessAlert('success', 800);
	  } catch (err: any) {
		console.log('ERROR, likeCarHandler:', err.message);
		sweetMixinErrorAlert(err.message).then();
	  }
	};
	

	const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		commentInquiry.page = value;
		setCommentInquiry({ ...commentInquiry });
	};

	const createCommentHandler = async () => {
  try {
    if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
    await createComment({ variables: { input: insertCommentData } });

    setInsertCommentData({ ...insertCommentData, commentContent: '' });

  } catch (err: any) {
    await sweetErrorHandling(err);
  }
};

// ============================================================
// FAQAT return(...) BLOKI — detail.tsx ichiga almashtiring
// ============================================================

if (getCarLoading) {
	return (
		<Stack
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				width: '100%',
				height: '100vh',
				background: '#0a0a0a',
			}}
		>
			<CircularProgress size={'4rem'} sx={{ color: '#c9a84c' }} />
		</Stack>
	);
}

if (device === 'mobile') {
	return <div>CAR DETAIL PAGE</div>;
} else {


	return (
		<div id={'car-detail-page'}>
			<div className={'container'}>
				<Stack className={'car-detail-config'}>

					{/* ─── HERO GALLERY ─────────────────────────────────────── */}
					<Stack className={'hero-gallery'}>
						<Stack className={'main-image-wrap'}>
							<img
								src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/banner/mans-sallon.webp'}
								alt={'main-image'}
							/>
							<Stack className={'hero-badge'}>
								{car?.carBarter && <span className={'badge barter'}>BARTER</span>}
								{car?.carRent && <span className={'badge rent'}>RENT</span>}
							</Stack>
							<Stack className={'hero-actions'}>
								<Stack className={'action-btn'}>
									<RemoveRedEyeIcon sx={{ fontSize: 18 }} />
									<Typography>{car?.carViews}</Typography>
								</Stack>
								<Stack
									className={'action-btn'}
									onClick={() => likeCarHandler(user, car?._id as string)}
									sx={{ cursor: 'pointer' }}
								>
									{car?.meLiked && car?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon sx={{ fontSize: 18, color: '#00c896' }} />
									) : (
										<FavoriteBorderIcon sx={{ fontSize: 18 }} />
									)}
									<Typography>{car?.carLikes}</Typography>
								</Stack>
							</Stack>
						</Stack>
					</Stack>

					{/* ─── TITLE BAR ────────────────────────────────────────── */}
					<Stack className={'title-bar'}>
						<Stack className={'title-left'}>
							<Typography className={'car-title'}>{car?.carTitle}</Typography>
							<Stack className={'meta-row'}>
								<Typography className={'meta-location'}>{car?.carLocation}</Typography>
								<span className={'dot'}>·</span>
								<Typography className={'meta-date'}>
									{moment().diff(car?.createdAt, 'days')} days ago
								</Typography>
							</Stack>
						</Stack>
						<Stack className={'title-right'}>
							<Typography className={'price-label'}>PRICE</Typography>
							<Typography className={'price-value'}>${formatterStr(car?.carPrice)}</Typography>
						</Stack>
					</Stack>

					{/* ─── SPEC STRIP ───────────────────────────────────────── */}
					<Stack className={'spec-strip'}>
						<Stack className={'spec-item'}>
							<Typography className={'spec-num'}>{car?.carEngine}</Typography>
							<Typography className={'spec-label'}>ENGINE</Typography>
						</Stack>
						<span className={'spec-divider'} />
						<Stack className={'spec-item'}>
							<Typography className={'spec-num'}>{car?.carDoors}</Typography>
							<Typography className={'spec-label'}>DOORS</Typography>
						</Stack>
						<span className={'spec-divider'} />
						<Stack className={'spec-item'}>
							<Typography className={'spec-num'}>{car?.carFuelType}</Typography>
							<Typography className={'spec-label'}>FUEL TYPE</Typography>
						</Stack>
						<span className={'spec-divider'} />
						<Stack className={'spec-item'}>
							<Typography className={'spec-num'}>{moment(car?.createdAt).format('YYYY')}</Typography>
							<Typography className={'spec-label'}>YEAR</Typography>
						</Stack>
						<span className={'spec-divider'} />
						<Stack className={'spec-item'}>
							<Typography className={'spec-num'}>{car?.carType}</Typography>
							<Typography className={'spec-label'}>TYPE</Typography>
						</Stack>
					</Stack>

					{/* ─── MAIN BODY ────────────────────────────────────────── */}
					<Stack className={'body-grid'}>

						<Stack className={'body-left'}>

							{/* 01 Overview */}
							<Stack className={'section-block'}>
								<Typography className={'section-heading'}>
									<span className={'heading-accent'}>01</span> Overview
								</Typography>
								<Typography className={'section-desc'}>{car?.carDesc ?? 'No description available.'}</Typography>
							</Stack>

							{/* 02 Specifications */}
							<Stack className={'section-block'}>
								<Typography className={'section-heading'}>
									<span className={'heading-accent'}>02</span> Specifications
								</Typography>
								<Stack className={'details-grid'}>
									{[
										{ label: 'Price', value: `$${formatterStr(car?.carPrice)}` },
										{ label: 'Fuel Type', value: car?.carFuelType },
										{ label: 'Doors', value: car?.carDoors },
										{ label: 'Engine', value: car?.carEngine },
										{ label: 'Year Built', value: moment(car?.createdAt).format('YYYY') },
										{ label: 'Car Type', value: car?.carType },
										{ label: 'Options', value: `${car?.carBarter ? 'Barter ' : ''}${car?.carRent ? 'Rent' : ''}` || '—' },
										{ label: 'Location', value: car?.carLocation },
									].map(({ label, value }) => (
										<Stack className={'detail-row'} key={label}>
											<Typography className={'detail-label'}>{label}</Typography>
											<Typography className={'detail-value'}>{value}</Typography>
										</Stack>
									))}
								</Stack>
							</Stack>

							{/* 03 Gallery — click opens lightbox, main image NOT changed */}
							<Stack className={'section-block gallery-block'}>
								<Typography className={'section-heading'} style={{color: '111', fontSize: '35px', fontBold: '500'}}>
									<span className={'heading-accent'}>03</span> Gallery
								</Typography>
								<Stack className={'gallery-grid'}>
									{car?.carImages.map((img: string, idx: number) => (
										<Stack
											className={`gallery-item gallery-item--${(idx % 5) + 1}`}
											key={img}
											onClick={() => {
												setLightboxIndex(idx);
												setLightboxOpen(true);
											}}
										>
											<img
												src={`${REACT_APP_API_URL}/${img}`}
												alt={`gallery-${idx}`}
											/>
										</Stack>
									))}
								</Stack>
							</Stack>

							{/* 04 Reviews */}
							{commentTotal !== 0 && (
								<Stack className={'section-block'}>
									<Typography className={'section-heading'}>
										<span className={'heading-accent'}>04</span> Reviews
										<span className={'review-count'}>{commentTotal}</span>
									</Typography>
									<Stack className={'review-list'}>
										{carComments?.map((comment: Comment) => (
											<Review comment={comment} key={comment?._id} />
										))}
										<Box component={'div'} className={'pagination-box'}>
											<MuiPagination
												page={commentInquiry.page}
												count={Math.ceil(commentTotal / commentInquiry.limit)}
												onChange={commentPaginationChangeHandler}
												shape="circular"
												color="primary"
											/>
										</Box>
									</Stack>
								</Stack>
							)}

							{/* 05 Leave a Review */}
							<Stack className={'section-block leave-review'}>
								<Typography className={'section-heading'}>
									<span className={'heading-accent'}>05</span> Leave a Review
								</Typography>
								<textarea
									placeholder={'Share your experience with this vehicle...'}
									onChange={({ target: { value } }: any) =>
										setInsertCommentData({ ...insertCommentData, commentContent: value })
									}
									value={insertCommentData.commentContent}
								/>
								<Box className={'submit-wrap'} component={'div'}>
									<Button
										className={'submit-btn'}
										disabled={insertCommentData.commentContent === '' || user?._id === ''}
										onClick={createCommentHandler}
									>
										Submit Review
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
											<path d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z" fill="currentColor" />
										</svg>
									</Button>
								</Box>
							</Stack>
						</Stack>

						{/* RIGHT SIDEBAR */}
						<Stack className={'body-right'}>
							<Stack className={'sidebar-card agent-card'}>
								<Typography className={'sidebar-heading'}>CONTACT AGENT</Typography>
								<Stack className={'agent-info'}>
									<img
										src={
											car?.memberData?.memberImage
												? `${REACT_APP_API_URL}/${car?.memberData?.memberImage}`
												: '/img/profile/defaultUser.svg'
										}
										alt={'agent'}
									/>
									<Stack className={'agent-meta'}>
										<Link href={`/member?memberId=${car?.memberData?._id}`}>
											<Typography className={'agent-name'}>{car?.memberData?.memberNick}</Typography>
										</Link>
										<Typography className={'agent-phone'}>{car?.memberData?.memberPhone}</Typography>
										<Typography className={'agent-listings'}>View All Listings →</Typography>
									</Stack>
								</Stack>
							</Stack>

							<Stack className={'sidebar-card contact-form'}>
								<Typography className={'sidebar-heading'}>SEND INQUIRY</Typography>
								<Stack className={'form-group'}>
									<label>Name</label>
									<input type={'text'} placeholder={'Your full name'} />
								</Stack>
								<Stack className={'form-group'}>
									<label>Phone</label>
									<input type={'text'} placeholder={'+82 10 0000 0000'} />
								</Stack>
								<Stack className={'form-group'}>
									<label>Email</label>
									<input type={'text'} placeholder={'your@email.com'} />
								</Stack>
								<Stack className={'form-group'}>
									<label>Message</label>
									<textarea placeholder={`Hello, I'm interested in ${car?.carTitle ?? 'this vehicle'}.`} />
								</Stack>
								<Button className={'send-btn'}>
									Send Message
									<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 17" fill="none">
										<path d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z" fill="white" />
									</svg>
								</Button>
							</Stack>
						</Stack>
					</Stack>

					{/* ─── SIMILAR CARS ─────────────────────────────────────── */}
					{destinationCars.length !== 0 && (
						<Stack className={'similar-section'}>
							<Stack className={'similar-header'}>
								<Stack>
									<Typography className={'similar-label'}>EXPLORE MORE</Typography>
									<Typography className={'similar-title'}>Similar Vehicles</Typography>
								</Stack>
								<Stack className={'swiper-nav'}>
									<WestIcon className={'swiper-similar-prev'} />
									<div className={'swiper-similar-pagination'} />
									<EastIcon className={'swiper-similar-next'} />
								</Stack>
							</Stack>
							<Swiper
								className={'similar-swiper'}
								slidesPerView={'auto'}
								spaceBetween={24}
								modules={[Autoplay, Navigation, Pagination]}
								navigation={{ nextEl: '.swiper-similar-next', prevEl: '.swiper-similar-prev' }}
								pagination={{ el: '.swiper-similar-pagination' }}
							>
								{destinationCars.map((car: Car) => (
									<SwiperSlide className={'similar-slide'} key={car.carTitle}>
										<CarCardDP car={car} likeCarHandler={likeCarHandler} key={car?._id} />
									</SwiperSlide>
								))}
							</Swiper>
						</Stack>
					)}

				</Stack>
			</div>

			{/* ─── LIGHTBOX MODAL ───────────────────────────────────── */}
			{lightboxOpen && car?.carImages && (
				<div
					className={'lightbox-overlay'}
					onClick={() => setLightboxOpen(false)}
				>
					<div
						className={'lightbox-inner'}
						onClick={(e) => e.stopPropagation()}
					>
						{/* Close button */}
						<button
							className={'lightbox-close'}
							onClick={() => setLightboxOpen(false)}
						>
							✕
						</button>

						{/* Counter */}
						<div className={'lightbox-counter'}>
							{lightboxIndex + 1} / {car.carImages.length}
						</div>

						{/* Prev arrow */}
						<button
							className={'lightbox-arrow lightbox-arrow--prev'}
							onClick={() =>
								setLightboxIndex((prev) =>
									prev === 0 ? car!.carImages.length - 1 : prev - 1
								)
							}
						>
							<WestIcon />
						</button>

						{/* Image */}
						<div className={'lightbox-img-wrap'}>
							<img
								src={`${REACT_APP_API_URL}/${car.carImages[lightboxIndex]}`}
								alt={`lightbox-${lightboxIndex}`}
							/>
						</div>

						{/* Next arrow */}
						<button
							className={'lightbox-arrow lightbox-arrow--next'}
							onClick={() =>
								setLightboxIndex((prev) =>
									prev === car!.carImages.length - 1 ? 0 : prev + 1
								)
							}
						>
							<EastIcon />
						</button>

						{/* Thumbnail strip at bottom */}
						<div className={'lightbox-thumbs'}>
							{car.carImages.map((img: string, idx: number) => (
								<div
									key={img}
									className={`lightbox-thumb ${idx === lightboxIndex ? 'active' : ''}`}
									onClick={() => setLightboxIndex(idx)}
								>
									<img src={`${REACT_APP_API_URL}/${img}`} alt={`lt-${idx}`} />
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);

}
};

CarDetail.defaultProps = {
	initialComment: {
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: '',
		},
	},
};

export default withLayoutFull(CarDetail);
