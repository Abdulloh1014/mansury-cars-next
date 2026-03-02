import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, Box } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { BoardArticleCategory } from '../../enums/board-article.enum';
import { T } from '../../types/common';

const CommunityBoards = () => {
    const device = useDeviceDetect();
    const [isMounted, setIsMounted] = useState(false);
    const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
    const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { data: newsData } = useQuery(GET_BOARD_ARTICLES, {
        fetchPolicy: 'network-only',
        variables: { input: { page: 1, limit: 3, sort: 'articleViews', direction: 'DESC', search: { articleCategory: BoardArticleCategory.NEWS } } },
        onCompleted: (data: T) => setNewsArticles(data?.getBoardArticles?.list || []),
    });

    const { data: freeData } = useQuery(GET_BOARD_ARTICLES, {
        fetchPolicy: 'network-only',
        variables: { input: { page: 1, limit: 3, sort: 'articleViews', direction: 'DESC', search: { articleCategory: BoardArticleCategory.FREE } } },
        onCompleted: (data: T) => setFreeArticles(data?.getBoardArticles?.list || []),
    });

    if (!isMounted) return null;

    return (
        <Stack className={'community-section'}>
            <Stack className={'container'}>
                <Stack className={'section-header'}>
                    <Typography variant={'h2'}>EDITORIALS</Typography>
                    <div className="line"></div>
                    <p>Stay updated with our latest world-class highlights</p>
                </Stack>

                <Stack className="community-grid">
                    {/* NEWS SECTION */}
                    <Stack className={'board-column'}>
                        <div className={'column-header'}>
                            <span>/ NEWS</span>
                            <Link href={'/community?articleCategory=NEWS'}>VIEW ALL</Link>
                        </div>
                        <Stack className={'cards-list'}>
                            {newsArticles.map((article, index) => (
                                <CommunityCard key={article?._id} vertical={true} article={article} index={index} />
                            ))}
                        </Stack>
                    </Stack>
                    
                    {/* FREE SECTION */}
                    <Stack className={'board-column'}>
                        <div className={'column-header'}>
                            <span>/ FREE BOARD</span>
                            <Link href={'/community?articleCategory=FREE'}>VIEW ALL</Link>
                        </div>
                        <Stack className={'cards-list'}>
                            {freeArticles.map((article, index) => (
                                <CommunityCard key={article?._id} vertical={false} article={article} index={index} />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default CommunityBoards;