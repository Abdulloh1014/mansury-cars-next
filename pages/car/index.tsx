import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import CarCard from '../../libs/components/car/CarCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/car/Filter';
import { useRouter } from 'next/router';
import { CarsInquiry } from '../../libs/types/car/car.input';
import { Car } from '../../libs/types/car/car';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { useMutation, useQuery } from '@apollo/client';
import { GET_CARS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_CAR } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const CarList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<CarsInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [cars, setCars] = useState<Car[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/
		const [likeTargetCar] = useMutation(LIKE_TARGET_CAR);
	


		const {
		  loading: getCarsLoading,
		  data: getCarsData,
		  error: getCarsError,
		  refetch: getCarsRefetch,
		} = useQuery(GET_CARS, {
		  fetchPolicy: 'network-only',
		  variables: { input: searchFilter },
		  notifyOnNetworkStatusChange: true,
		  onCompleted: (data: T) => {
			setCars(data?.getCars?.list);
			setTotal(data?.getCars?.metaCounter[0]?.total);
		  },
		});

	/** LIFECYCLES **/
	// Filter controls update the URL with router.push. Keep the query state in
	// sync so Apollo refetches with the selected filters.
	useEffect(() => {
		const input = router.query.input;
		if (typeof input !== 'string') return;

		try {
			const nextFilter = JSON.parse(input) as CarsInquiry;
			setSearchFilter((currentFilter) =>
				JSON.stringify(currentFilter) === JSON.stringify(nextFilter) ? currentFilter : nextFilter,
			);
		} catch (error) {
			console.error('Invalid car filter in URL:', error);
		}
	}, [router.query.input]);

	useEffect(() => {
    getCarsRefetch({ input: searchFilter });
}, [searchFilter]);

	

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
    const updatedFilter = { ...searchFilter, page: value };
    setSearchFilter(updatedFilter);  // ← state ni ham yangilaymiz
    setCurrentPage(value);
    
    await router.push(
        `/car?input=${JSON.stringify(updatedFilter)}`,
        `/car?input=${JSON.stringify(updatedFilter)}`,
        { scroll: false }
    );
};

		const likeCarHandler = async (user: T, id: string) => {
    try {
        if (!id) return;
        if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

        await likeTargetCar({ variables: { input: id } });
        await getCarsRefetch({ input: searchFilter }); // ← initialInput emas, searchFilter
        await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
        console.log('ERROR, likeCarHandler:', err.message);
        sweetMixinErrorAlert(err.message).then();
    }
};
	

	const sortingClickHandler = () => {
		setSortingOpen((open) => !open);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'carPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'carPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
	};

	if (device === 'mobile') {
		return <h1>CARS MOBILE</h1>;
	} else {
		return (
			<div id="car-list-page" style={{ position: 'relative' }}>
				<div className="container">


					<Box component={'div'} className={'right'}>
						<span style={{ color: '#949598' }}>Sort by</span>
						<div
							style={{ position: 'relative' }}
							onBlur={(event) => {
								if (!event.currentTarget.contains(event.relatedTarget as Node | null)) sortingCloseHandler();
							}}
							onKeyDown={(event) => {
								if (event.key === 'Escape') sortingCloseHandler();
							}}
						>
							<Button
								aria-haspopup="menu"
								aria-expanded={sortingOpen}
								onClick={sortingClickHandler}
								endIcon={<KeyboardArrowDownRoundedIcon sx={{ paddingTop: '5px', color: '#fff' }} />}
							>
								{filterSortName}
							</Button>
							{sortingOpen && (
								<Box
									role="menu"
									sx={{
										position: 'absolute',
										top: 'calc(100% + 4px)',
										right: 0,
										zIndex: 10,
										minWidth: 160,
										py: 0.5,
										backgroundColor: '#fff',
										boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
									}}
								>
								<MenuItem
									onClick={sortingHandler}
									id={'new'}
									disableRipple
									sx={{ boxShadow: 'rgba(49, 57, 65, 0.9) 0px 8px 24px' }}
								>
									New
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'lowest'}
									disableRipple
									sx={{ boxShadow: 'rgba(49, 57, 65, 0.9) 0px 8px 24px' }}
								>
									Lowest Price
								</MenuItem>
								<MenuItem
									onClick={sortingHandler}
									id={'highest'}
									disableRipple
									sx={{ boxShadow: 'rgba(49, 57, 65, 0.9) 0px 8px 24px' }}
									// sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
								>
									Highest Price
								</MenuItem>
								</Box>
							)}
						</div>
					</Box>


					<Stack className={'car-page'}>



						<Stack className={'filter-config'}>
							{/* @ts-ignore */}
							<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
						</Stack>



						<Stack className="main-config" mb={'76px'}>
							
							<Stack className={'list-config'}>
								{cars?.length === 0 ? (
									<div className={'no-data'}>
										<img src="/img/icons/icoAlert.svg" alt="" />
										<p>No Cars found!</p>
									</div>
								) : (
									cars.map((car: Car) => {
										return <CarCard car={car} likeCarHandler={likeCarHandler} key={car?._id} />;
									})
								)}
							</Stack>

						    <Stack className="pagination-config">
                              {cars.length !== 0 && (
                                <Stack className="pagination-box">
                                 <Pagination
                                  page={currentPage}
                                  count={Math.ceil(total / searchFilter.limit)}
                                  onChange={handlePaginationChange}
                                   variant="outlined"
                                   shape="rounded"
                                  size="large"
                                    />
                                </Stack>
                                )}

                                  {cars.length !== 0 && (
                               <Stack className="total-result">
                                  <Typography>
                                   {total} Car{total > 1 ? "s" : ""} Available
                                   </Typography>
                                </Stack>
                                  )}
                           </Stack>

						</Stack>






					</Stack>
				</div>
			</div>
		);
	}
};

CarList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			mileageRange: {
				start: 0,
				end: 500,
			},
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(CarList);
