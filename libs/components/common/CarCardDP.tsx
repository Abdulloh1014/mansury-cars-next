import React from 'react';
import { Stack, Box, Divider, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Car } from '../../types/car/car';
import { REACT_APP_API_URL, topCarRank } from '../../config';
import { formatterStr } from '../../utils';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

interface CarBigCardProps {
	car: Car;
	likeCarHandler?: any;
}

const CarCardDP = (props: CarBigCardProps) => {
	const { car, likeCarHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const router = useRouter();

	/** HANDLERS **/
	const goCarDetatilPage = (carId: string) => {
		router.push(`/car/detail?id=${carId}`);
	};

	if (device === 'mobile') {
		return <div>APARTMEND BIG CARD</div>;
	} else {

	// CarBigCard.tsx — faqat return() qismini almashtiring

return (
    <Stack className="car-card-dp" onClick={() => goCarDetatilPage(car?._id)}>

        {/* ── IMAGE ─────────────────────────────────────── */}
        <Box
            component={'div'}
            className={'card-img'}
            style={{ backgroundImage: `url(${REACT_APP_API_URL}/${car?.carImages?.[0]})` }}
        >
            {/* TOP badge */}
            {car && car?.carRank >= topCarRank && (
                <div className={'status'}>
                    <img src="/img/icons/electricity.svg" alt="" />
                    <span>TOP</span>
                </div>
            )}

            {/* Rent / Barter badges */}
            <div className={'badges'}>
                {car?.carRent && <span className={'badge'}>RENT</span>}
                {car?.carBarter && <span className={'badge'}>BARTER</span>}
            </div>

            {/* Price overlay */}
            <div className={'price'}>${formatterStr(car?.carPrice)}</div>
        </Box>

        {/* ── INFO ──────────────────────────────────────── */}
        <Box component={'div'} className={'info'}>

            {/* Title + location */}
            <div className={'info-top'}>
                <strong className={'title'}>{car?.carTitle}</strong>
                <span className={'mileage'}>{car?.carMileage} km</span>
            </div>

            {/* Specs row */}
            <div className={'specs'}>
                <div className={'spec-item'}>
                    <img src="/img/icons/engine.svg" alt="" />
                    <span>{car?.carEngine}</span>
                </div>
                <span className={'spec-dot'} />
                <div className={'spec-item'}>
                    <img src="/img/icons/car door.svg" alt="" />
                    <span>{car?.carDoors}</span>
                </div>
                <span className={'spec-dot'} />
                <div className={'spec-item'}>
                    <img src="/img/icons/fuel.svg" alt="" />
                    <span>{car?.carFuelType}</span>
                </div>
                <span className={'spec-dot'} />
                <div className={'spec-item'}>
                    <img src="/img/icons/mile.png" alt="" />
                    <span>{car?.carMileage}</span>
                </div>
            </div>

            {/* Bottom row */}
            <div className={'bott'}>
                <div className={'bott-left'}>
                    {car?.carRent   && <span className={'tag'}>Rent</span>}
                    {car?.carBarter && <span className={'tag'}>Barter</span>}
                </div>
                <div className={'bott-right'}>
                    <div className={'stat'}>
                        <RemoveRedEyeIcon sx={{ fontSize: 15 }} />
                        <span>{car?.carViews}</span>
                    </div>
                    <div
                        className={'stat'}
                        onClick={(e) => {
                            e.stopPropagation();
                            likeCarHandler(user, car?._id);
                        }}
                    >
                        {car?.meLiked && car?.meLiked[0]?.myFavorite ? (
                            <FavoriteIcon sx={{ fontSize: 15, color: '#00c896' }} />
                        ) : (
                            <FavoriteIcon sx={{ fontSize: 15 }} />
                        )}
                        <span>{car?.carLikes}</span>
                    </div>
                </div>
            </div>
        </Box>
    </Stack>
);

	}
};

export default CarCardDP;
