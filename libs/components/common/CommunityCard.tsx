import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import { BoardArticle } from '../../types/board-article/board-article';
import Moment from 'react-moment';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface CommunityCardProps {
	boardArticle: BoardArticle;
	size?: string;
	likeArticleHandler: any;
}

const CommunityCard = (props: CommunityCardProps) => {
	const { boardArticle, likeArticleHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const imagePath: string = boardArticle?.articleImage
		? `${REACT_APP_API_URL}/${boardArticle?.articleImage}`
		: '/img/community/communityImg.png';

	const chooseArticleHandler = (e: React.SyntheticEvent, boardArticle: BoardArticle) => {
		router.push(
			{
				pathname: '/community/detail',
				query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
			},
			undefined,
			{ shallow: true },
		);
	};

	const goMemberPage = (id: string) => {
		if (id === user?._id) router.push('/mypage');
		else router.push(`/member?memberId=${id}`);
	};

	if (device === 'mobile') return <div>COMMUNITY CARD MOBILE</div>;

	return (
		<Stack
			className="community-general-card-config"
			onClick={(e) => chooseArticleHandler(e, boardArticle)}
		>
			{/* Image */}
			<img src={imagePath} alt="" className="card-img" />

			{/* Always visible: category + date top row */}
			<Stack className="card-top">
				<Typography className="category">{boardArticle?.articleCategory}</Typography>
				<Typography className="date-badge">
					<Moment format={'MMMM DD, YYYY'}>{boardArticle?.createdAt}</Moment>
				</Typography>
			</Stack>

			{/* Bottom content — slides up on hover */}
			<Stack className="card-bottom">
				<Typography className="title">{boardArticle?.articleTitle}</Typography>
				<Typography
					className="author"
					onClick={(e) => {
						e.stopPropagation();
						goMemberPage(boardArticle?.memberData?._id as string);
					}}
				>
					{boardArticle?.memberData?.memberNick}
				</Typography>

				<Stack className="meta">
					<Stack className="views">
						<RemoveRedEyeIcon />
						<Typography>{boardArticle?.articleViews}</Typography>
					</Stack>
					<Stack
						className="likes"
						onClick={(e: any) => likeArticleHandler(e, user, boardArticle?._id)}
					>
						{boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon />
						) : (
							<FavoriteBorderIcon />
						)}
						<Typography>{boardArticle?.articleLikes}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default CommunityCard;