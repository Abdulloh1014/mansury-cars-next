import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';
import { REACT_APP_API_URL } from '../../config';

interface Car {
	
	_id: string;
	carTitle: string;
	carImages: string[];
	carViews: number;
}

interface Props {
	cars: Car[];
	
}

const FiberContainer = ({ cars }: Props) => {
	const router = useRouter();
	const [index, setIndex] = useState(0);

const pushDetailHandler = async () => {
  await router.push({
    pathname: "/car/detail",
    query: { id: activeCar._id },
  });
};

	// 🔥 Eng ko‘p view bo‘lgan 5 ta
	const topCars = useMemo(() => {
		return [...cars]
			.sort((a, b) => b.carViews - a.carViews)
			.slice(0, 9);
	}, [cars]);

	// 🔁 Auto slide
	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prev) => (prev + 1) % topCars.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [topCars.length]);

	if (!topCars.length) return null;

	const activeCar = topCars[index];
	console.log(activeCar.carImages);

	return (
		<Box
			sx={{
				position: 'relative',
				width: '100%',
				height: '1160px',
				overflow: 'hidden',
			}}
		>
			{/* Background Image */}
			<Box
				sx={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					// backgroundImage: `url(${process.env.REACT_APP_API_URL}/${activeCar.carImages[0]})`,
					 backgroundImage: `url(${REACT_APP_API_URL}/${activeCar.carImages[0]})`,
					// backgroundColor: '#f3434a',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					transition: '0.8s ease',
				}}
			/>

			{/* Dark Overlay */}
			<Box
				sx={{
					position: 'absolute',
					width: '100%',
					height: '100%',
					background: 'rgba(0,0,0,0.45)',
				}}
			/>

			{/* Content */}
			<Box
				sx={{
					position: 'relative',
					zIndex: 2,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					paddingLeft: '120px',
					color: '#fff',
					
				}}
			>
				<Typography variant="h2" sx={{
                   mb: 4,
                   fontSize: { xs: '36px', md: '56px', lg: '68px' },
                   fontWeight: 800,
                   lineHeight: 1.1,
                   letterSpacing: '-1px',
                   }}>
					{activeCar.carTitle}
				</Typography>

				<Button
					variant="contained"
					sx={{
						width: '180px',
						height: '50px',
						backgroundColor: '#8fa9c0',
						'&:hover': { backgroundColor: '#6e8aa3' },
					}}
					onClick={pushDetailHandler}
				>
					DISCOVER NOW
				</Button>
			</Box>

			{/* Dots */}
			<Box
				sx={{
					position: 'absolute',
					bottom: 40,
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					gap: 2,
				}}
			>
				{topCars.map((_, i) => (
					<Box
						key={i}
						onClick={() => setIndex(i)}
						sx={{
							width: 40,
							height: 3,
							backgroundColor: i === index ? '#fff' : '#777',
							cursor: 'pointer',
						}}
					/>
				))}
			</Box>
		</Box>
	);
};

export default FiberContainer;