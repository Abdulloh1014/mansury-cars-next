import React from 'react';
import { Box, Typography } from '@mui/material';

import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { Car } from '../../types/car/car';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface TrendCarCardProps {
	car: Car;
	likeCarHandler: any;
}

const TrendCarCard = ({ car, likeCarHandler }: TrendCarCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const device = useDeviceDetect();

	const pushDetailHandler = async () => {
		await router.push({
			pathname: '/car/detail',
			query: { id: car._id },
		});
	};

	/* ===== BADGE LOGIC (REAL MODEL BASED) ===== */

	const renderBadge = () => {
	const isNew =
		new Date(car.createdAt).getTime() >
		Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 kun

	if (car.carRank >= 8) return 'ATELIER';
	if (car.carLikes >= 20) return 'ONE OF ONE';
	if (isNew) return 'LATEST';

	return null;
};

	const badge = renderBadge();

	return (
		<Box className={`trend-lux-card ${device}`}>
			<Box
				className="trend-lux-card__image"
				style={{
					backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages?.[0]})`,
				}}
				onClick={pushDetailHandler}
			>

				{/* BADGE */}
				{badge && (
					<Box className="trend-lux-card__badges">
						<span className="badge">{badge}</span>
					</Box>
				)}

				<Box className="trend-lux-card__overlay" />

				<Box className="trend-lux-card__content">

					<Typography className="title">
						{car.carTitle}
					</Typography>

					<Typography className="price">
						${car.carPrice}
					</Typography>

					<Box className="footer">

				

					</Box>

				</Box>

			</Box>
		</Box>
	);
};

export default TrendCarCard;