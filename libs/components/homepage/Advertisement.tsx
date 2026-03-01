import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Stack, Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useQuery } from '@apollo/client';
import { GET_CARS } from '../../../apollo/user/query';
import { Car } from '../../types/car/car';
import { CarsInquiry } from '../../types/car/car.input';
import { T } from '../../types/common';

interface PremiumCarsProps {
  initialInput: CarsInquiry;
}

const PremiumCars = ({ initialInput }: PremiumCarsProps) => {
  const router = useRouter();

  const { data } = useQuery(GET_CARS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: initialInput },
  });

  const cars: Car[] = data?.getCars?.list || [];

  // 🔥 Eng qimmat 2 ta mashina
  const premiumCars = useMemo(() => {
    return [...cars]
      .sort((a, b) => b.carPrice - a.carPrice)
      .slice(0, 2);
  }, [cars]);

  if (!premiumCars.length) return null;

  return (
     <Stack className="premium-container">

        <Stack className="premium-header">
          <h1>Premium Cars</h1>
        </Stack>
		
		<Stack className="premium-cards">
            {premiumCars.map((car) => (
        <Box
          key={car._id}
          className="premium-card"
          sx={{
           backgroundImage: `url(${process.env.NEXT_PUBLIC_API_URL}/${car.carImages?.[0]})`,
          }}
        >
          <Box className="overlay">
            <Typography variant="h4" className="car-title">
              {car.carTitle}
            </Typography>

            <Typography variant="body2" className="car-desc">
              {car.carDesc || 'Premium luxury vehicle with high performance.'}
            </Typography>

            <button
              className="arrow-btn"
              onClick={() => router.push(`/car/detail/${car._id}`)}
            >
              <ArrowForwardIcon />
            </button>
          </Box>
        </Box>
      ))}
		</Stack>
     
    </Stack>
  );
};

PremiumCars.defaultProps = {
  initialInput: {
    page: 1,
    limit: 10, // ko‘proq olib kelamiz, keyin sort qilamiz
    sort: 'createdAt',
    direction: 'DESC',
    search: {},
  },
};

export default PremiumCars;