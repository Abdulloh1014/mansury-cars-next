import React from 'react';

import {
	Stack,
	Typography,
	Box,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Divider,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Car } from '../../types/car/car';
import Link from 'next/link';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface CarCardType {
	car: Car;
	likeCarHandler?: any;
	myFavorites?: boolean;
	recentlyVisited?: boolean;
}

const CarCard = (props: CarCardType) => {
	const { car, likeCarHandler, myFavorites, recentlyVisited } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = car?.carImages[0]
		? `${REACT_APP_API_URL}/${car?.carImages[0]}`
		: '/img/banner/header1.svg';

	if (device === 'mobile') {
		return <div>CAR CARD</div>;
	} else {
		return (
			<Stack className="card-config">


				<Stack className="top">
					<Link
						href={{
							pathname: '/car/detail',
							query: { id: car?._id },
						}}
					>
						<img src={imagePath} alt="" />
					</Link>
					{car && car?.carRank > topCarRank && (
						<Box component={'div'} className={'top-badge'}>
							<img src="/img/icons/electricity.svg" alt="" />
							<Typography>HOT</Typography>
						</Box>
					)}
					<Box component={'div'} className={'price-box'}>
						<Typography>${formatterStr(car?.carPrice)}</Typography>
					</Box>
				</Stack>



				<Stack className="bottom">


					<Stack className="name-address">
						<Stack className="name">
							<Link
								href={{
									pathname: '/car/detail',
									query: { id: car?._id },
								}}
							>
								<Typography>{car.carTitle}</Typography>
							</Link>
						</Stack>
						<Stack className="address">
							<Typography>
								 
								 {car.carLocation}
							</Typography>
						</Stack>
					</Stack>


					<Stack className="options">

						<Stack className="bir">
							<Stack className="option">
							<img 
							style={{ width: '16px', height: '16px', filter: 'invert(42%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(93%) contrast(90%)'  }}
							src="/img/icons/engine.svg" alt="" /> <Typography>{car.carEngine} Engine</Typography>
						</Stack>
						<Stack className="option">
							<img 
							style={{ width: '16px', height: '16px', filter: 'invert(42%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(93%) contrast(90%)'  }}
							src="/img/icons/car door.svg" alt="" /> <Typography>{car.carDoors} Door</Typography>
						</Stack>
						</Stack>


						<Stack className="ikki">
							<Stack className="option">
							<img 
							style={{ width: '16px', height: '16px', filter: 'invert(42%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(93%) contrast(90%)'  }}
							src="/img/icons/fuel.svg" alt="" /> <Typography>{car.carFuelType}</Typography>
						</Stack>
						<Stack className="option">
							<img 
							style={{ width: '16px', height: '16px', filter: 'invert(42%) sepia(0%) saturate(0%) hue-rotate(175deg) brightness(93%) contrast(90%)'  }}
							src="/img/icons/mile.png" alt="" /> <Typography>{car.carMileage.toLocaleString()} km</Typography>
						</Stack>
						</Stack>

					</Stack>

						


						




					


					<Stack className="type-buttons">
						<Stack className="type">
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={car.carRent ? '' : 'disabled-type'}
							>
								Rent
							</Typography>
							<Typography
								sx={{ fontWeight: 500, fontSize: '13px' }}
								className={car.carBarter ? '' : 'disabled-type'}
							>
								Barter
							</Typography>
						</Stack>

						{!recentlyVisited && (
							<Stack className="buttons">
								<IconButton color={'default'}>
									<RemoveRedEyeIcon />
								</IconButton>
								<Typography className="view-cnt">{car?.carViews}</Typography>
								<IconButton color={'default'} onClick={() => likeCarHandler(user, car?._id)}>
									{myFavorites ? (
										<FavoriteIcon color="primary" />
									) : car?.meLiked && car?.meLiked[0]?.myFavorite ? (
										<FavoriteIcon color="primary" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="view-cnt">{car?.carLikes}</Typography>
								
							</Stack>

						)}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default CarCard;
