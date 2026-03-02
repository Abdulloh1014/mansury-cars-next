import React from 'react';
import Link from 'next/link';
import { Box, Stack } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';

interface CommunityCardProps {
    vertical: boolean;
    article: BoardArticle;
    index: number;
}

const CommunityCard = ({ vertical, article, index }: CommunityCardProps) => {
    const articleImage = article?.articleImage
        ? `${process.env.REACT_APP_API_URL}/${article?.articleImage}`
        : '/img/no-image.jpg';

    return (
        <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
            <Box className={`premium-cardss ${vertical ? 'vertical' : 'horizontal'}`}>
                <div className="img-wrapper">
                    <div className="image" style={{ backgroundImage: `url(${articleImage})` }} />
                    <div className="overlay-number">{String(index + 1).padStart(2, '0')}</div>
                </div>
                <Stack className="content">
                    <span className="category-tag">{article?.articleCategory}</span>
                    <strong className="title">{article?.articleTitle}</strong>
                    <div className="footer">
                        <Moment format="MMM DD, YYYY">{article?.createdAt}</Moment>
                        <div className="read-more">EXPLORE</div>
                    </div>
                </Stack>
            </Box>
        </Link>
    );
};

export default CommunityCard;