import React from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Box, Typography, IconButton, Card, CardMedia } from '@mui/material';
import Link from 'next/link';
import { REACT_APP_API_URL } from '../../config';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import router from 'next/router';
import { sweetErrorHandling } from '../../sweetAlert';
import { redirectToMemberPage } from '../../utils';

interface AgentCardProps {
	agent: any;
	likeMemberHandler: any;
}




const AgentCard = (props: AgentCardProps) => {
	const { agent, likeMemberHandler } = props;
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const imagePath: string = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div style={{ color: '#fff' }}>AGENT CARD MOBILE</div>;
	} else {
		return (
			<Card className="agent-general-card">
				<Box className="agent-img-wrapper"
	                 onClick={() => redirectToMemberPage(router, user, agent?._id)}
                      >
	                <CardMedia image={imagePath} className="agent-img" />
                </Box>

				<Stack className="agent-desc">
					<Box className="agent-info">
						<Link
							href={{
								pathname: '/agent/detail',
								query: { agentId: agent?._id },
							}}
						>
							<Typography className="agent-name">
								{agent?.memberFullName ?? agent?.memberNick}
							</Typography>
						</Link>
						<Typography className="agent-title"> {agent?.memberCars >= 2 ? 'Active' : ''} Agent</Typography>
						<div className="car-badge"  >
							{agent?.memberCars ?? 0} CARS
						</div>
					</Box>



					<Stack direction="row" className="buttons-group">
						<div className='desc-agent' >
							{agent?.memberDesc ?? ''}
						</div>


						{/* <Stack direction="row" alignItems="center" spacing={0.5}>
							<IconButton size="small" disableRipple>
								<RemoveRedEyeIcon sx={{ color: '#94a3b8', fontSize: '20px' }} />
							</IconButton>
							<Typography className="stats-cnt">{agent?.memberViews}</Typography>
						</Stack> */}

						<Stack direction="row" alignItems="center" spacing={0.5}>
							<IconButton 
								size="small" 
								onClick={() => likeMemberHandler(user, agent?._id)}
							>
								{agent?.meLiked && agent?.meLiked[0]?.myFavorite ? (
									<FavoriteIcon sx={{ color: '#ef4444' }} />
								) : (
									<FavoriteBorderIcon sx={{ color: '#94a3b8' }} />
								)}
							</IconButton>
							
							<Typography className="stats-cnt">{agent?.memberLikes}</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Card>
		);
	}
};

export default AgentCard;