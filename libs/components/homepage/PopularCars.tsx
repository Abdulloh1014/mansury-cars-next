import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import PopularCarCard from './PopularCarCard';
import { Car } from '../../types/car/car';
import Link from 'next/link';
import { CarsInquiry } from '../../types/car/car.input';
import { GET_CARS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';

interface PopularCarsProps {
	initialInput: CarsInquiry;
}

const PopularCars = (props: PopularCarsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const [popularCars, setPopularCars] = useState<Car[]>([]);

	/** APOLLO REQUESTS **/

		const {
	  loading: getCarsLoading,
	  data: getCarsData,
	  error: getCarsError,
	  refetch: getCarsRefetch,
	} = useQuery(GET_CARS, {
	  fetchPolicy: 'cache-and-network',
	  variables: { input: initialInput },
	  notifyOnNetworkStatusChange: true,
	  onCompleted: (data: T) => {
		setPopularCars(data?.getCars?.list);
	  },
	});
	/** HANDLERS **/

	if (!popularCars) return null;

	if (device === 'mobile') {
		return (
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<span>NEW EVENTS</span>
					</Stack>
					<Stack className={'card-box'}>
						<Swiper
							className={'popular-car-swiper'}
							slidesPerView={'auto'}
							centeredSlides={true}
							spaceBetween={25}
							modules={[Autoplay]}
						>
							{popularCars.map((car: Car) => {
								return (
									<SwiperSlide key={car._id} className={'popular-car-slide'}>
										<PopularCarCard car={car} />
									</SwiperSlide>
								);
							})}
						</Swiper>
					</Stack>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-cars'}>
				<Stack className={'container'}>

					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							{/* sx={{color: '#fff'}} */}
							<span style={{ color: '#ffffff' }}>NEW EVENTS</span>
							
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'}>
								<Link href={'/car'}>
									<span>See All Categories</span>
								</Link>
								
							</div>
						</Box>
					</Stack>

					
					<Stack className={'card-box'}>


						<div className={'popular-car-swiper'}>
							{popularCars.map((car: Car) => {
								return (
									<SwiperSlide key={car._id} className={'popular-car-slide'}>
										<PopularCarCard car={car} />
									</SwiperSlide>
								);
							})}
						</div>




					</Stack>
					
				</Stack>
			</Stack>
		);
	}
};

PopularCars.defaultProps = {
	initialInput: {
		page: 1,
		limit: 2,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default PopularCars;
