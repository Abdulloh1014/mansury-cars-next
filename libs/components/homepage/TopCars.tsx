import React, { useState } from 'react';
import { Stack, Box, Typography, Button } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BoardArticle } from '../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../config';
import { MemberType } from '../../enums/member.enum';

const TopCars = () => {
	const device = useDeviceDetect();
	const [articles, setArticles] = useState<BoardArticle[]>([]);

	/** APOLLO REQUESTS **/
	const { loading, data } = useQuery(GET_BOARD_ARTICLES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 2, 
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},

		onCompleted: (data) => {
			console.log(data);
			setArticles(data?.getBoardArticles?.list);
		},
	});

	return (
		<Stack className={'articles-section'}>
			<Stack className={'container'}>
				{articles?.map((article: BoardArticle, index: number) => {
					// Juft indekslar uchun: Matn chapda, Rasm o'ngda
					// Toq indekslar uchun: Rasm chapda, Matn o'ngda (reversed)
					const isReversed = index % 2 !== 0;

					return (
						<Stack
							key={article._id}
							className={`article-row ${isReversed ? 'reversed' : ''}`}
							direction={device === 'mobile' ? 'column' : 'row'}
						>
							{/* Matn qismi */}
							<Box className={'text-box'}>
								<Typography variant="h2" className={'title'}>
									{article.articleTitle}
								</Typography>
								<Typography className={'description'}>
									{/* HTML teglarni tozalab faqat matnni chiqarish */}
									{article.articleContent.replace(/<[^>]*>?/gm, '').slice(0, 200)}...
								</Typography>
								<Button className={'read-more-btn'}>READ MORE</Button>
							</Box>

							{/* Rasm qismi */}
							<Box
								className={'image-box'}
								style={{
									backgroundImage: `url(${REACT_APP_API_URL}/${article.articleImage})`,
								}}
							/>
						</Stack>
					);
				})}
			</Stack>
		</Stack>
	);
};

export default TopCars;