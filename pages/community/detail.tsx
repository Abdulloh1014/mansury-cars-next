import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Button, Stack, Typography, IconButton, Backdrop, Pagination } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useReactiveVar } from '@apollo/client';
import Moment from 'react-moment';
import { userVar } from '../../apollo/store';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChatIcon from '@mui/icons-material/Chat';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import { CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import dynamic from 'next/dynamic';
import { CommentStatus } from '../../libs/enums/comment.enum';
import { T } from '../../libs/types/common';
import EditIcon from '@mui/icons-material/Edit';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOARD_ARTICLE, GET_COMMENTS } from '../../apollo/user/query';
import { CommentInput } from '../../libs/types/comment/comment.input';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Messages } from '../../libs/config';
import { CommentUpdate } from '../../libs/types/comment/comment.update';
import {
    sweetConfirmAlert,
    sweetMixinErrorAlert,
    sweetMixinSuccessAlert,
    sweetTopSmallSuccessAlert,
} from '../../libs/sweetAlert';
import { CREATE_COMMENT, LIKE_TARGET_BOARD_ARTICLE, UPDATE_COMMENT } from '../../apollo/user/mutation';

const ToastViewerComponent = dynamic(() => import('../../libs/components/community/TViewer'), { ssr: false });

export const getStaticProps = async ({ locale }: any) => ({
    props: {
        ...(await serverSideTranslations(locale, ['common'])),
    },
});

const TABS = [
    { value: 'FREE', label: 'All' },
    { value: 'RECOMMEND', label: 'Living Tips' },
    { value: 'NEWS', label: 'News' },
    { value: 'HUMOR', label: 'Trends' },
];

const CommunityDetail: NextPage = ({ initialInput, ...props }: T) => {
    const device = useDeviceDetect();
    const router = useRouter();
    const { query } = router;

    const articleId = query?.id as string;
    const articleCategory = query?.articleCategory as string;

    const [comment, setComment] = useState<string>('');
    const [wordsCnt, setWordsCnt] = useState<number>(0);
    const [updatedCommentWordsCnt, setUpdatedCommentWordsCnt] = useState<number>(0);
    const user = useReactiveVar(userVar);
    const [comments, setComments] = useState<Comment[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [searchFilter, setSearchFilter] = useState<CommentsInquiry>({ ...initialInput });
    const [memberImage, setMemberImage] = useState<string>('/img/community/articleImg.png');
    const [openBackdrop, setOpenBackdrop] = useState<boolean>(false);
    const [updatedComment, setUpdatedComment] = useState<string>('');
    const [updatedCommentId, setUpdatedCommentId] = useState<string>('');
    const [likeLoading, setLikeLoading] = useState<boolean>(false);
    const [boardArticle, setBoardArticle] = useState<BoardArticle>();

    /** APOLLO REQUESTS **/
    const [likeTargetBoardArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);
    const [createComment] = useMutation(CREATE_COMMENT);
    const [updateComment] = useMutation(UPDATE_COMMENT);

    const { refetch: boardArticleRefetch } = useQuery(GET_BOARD_ARTICLE, {
        fetchPolicy: 'network-only',
        variables: { input: articleId },
        notifyOnNetworkStatusChange: true,
        onCompleted(data: any) {
            setBoardArticle(data?.getBoardArticle);
            if (data?.getBoardArticle?.memberData?.memberImage) {
                setMemberImage(`${process.env.REACT_APP_API_URL}/${data?.getBoardArticle?.memberData?.memberImage}`);
            }
        },
    });

    const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
        fetchPolicy: 'cache-and-network',
        variables: { input: searchFilter },
        notifyOnNetworkStatusChange: true,
        onCompleted(data: any) {
            setComments(data.getComments.list);
            setTotal(data.getComments?.metaCounter?.[0]?.total || 0);
        },
    });

    /** LIFECYCLES **/

    



    useEffect(() => {
        if (articleId) setSearchFilter({ ...searchFilter, search: { commentRefId: articleId } });
    }, [articleId]);

    /** HANDLERS **/
    const tabChangeHandler = (value: string) => {
        router.replace({ pathname: '/community', query: { articleCategory: value } }, '/community', { shallow: true });
    };

    const likeBoArticleHandler = async (user: any, id: any) => {
        try {
            if (likeLoading || !id) return;
            if (!user._id) throw new Error(Messages.error2);
            setLikeLoading(true);
            await likeTargetBoardArticle({ variables: { input: id } });
            await boardArticleRefetch({ input: articleId });
            await sweetTopSmallSuccessAlert('Success!', 800);
        } catch (err: any) {
            sweetMixinErrorAlert(err.message).then();
        } finally {
            setLikeLoading(false);
        }
    };

    const creteCommentHandler = async () => {
        if (!comment) return;
        try {
            if (!user?._id) throw new Error(Messages.error2);
            const commentInput: CommentInput = {
                commentGroup: CommentGroup.ARTICLE,
                commentRefId: articleId,
                commentContent: comment,
            };
            await createComment({ variables: { input: commentInput } });
            await getCommentsRefetch({ input: searchFilter });
            await boardArticleRefetch({ input: articleId });
            setComment('');
            await sweetMixinSuccessAlert('Successfully commented!');
        } catch (error: any) {
            await sweetMixinErrorAlert(error.message);
        }
    };

    const updateButtonHandler = async (commentId: string, commentStatus?: CommentStatus.DELETE) => {
        try {
            if (!user?._id) throw new Error(Messages.error2);
            if (!commentId) throw new Error('Select a comment to update!');
            const updateData: CommentUpdate = {
                _id: commentId,
                ...(commentStatus && { commentStatus }),
                ...(updatedComment && { commentContent: updatedComment }),
            };
            if (!updateData?.commentContent && !updateData?.commentStatus) throw new Error('Provide data to update!');
            if (commentStatus) {
                if (await sweetConfirmAlert('Do you want to delete the comment?')) {
                    await updateComment({ variables: { input: updateData } });
                    await sweetMixinSuccessAlert('Successfully deleted!');
                } else return;
            } else {
                await updateComment({ variables: { input: updateData } });
                await sweetMixinSuccessAlert('Successfully updated!');
            }
            await getCommentsRefetch({ input: searchFilter });
        } catch (error: any) {
            await sweetMixinErrorAlert(error.message);
        } finally {
            setOpenBackdrop(false);
            setUpdatedComment('');
            setUpdatedCommentWordsCnt(0);
            setUpdatedCommentId('');
        }
    };

    const getCommentMemberImage = (imageUrl: string | undefined) => {
        if (imageUrl) return `${process.env.REACT_APP_API_URL}/${imageUrl}`;
        return '/img/community/articleImg.png';
    };

    const goMemberPage = (id: any) => {
        if (id === user?._id) router.push('/mypage');
        else router.push(`/member?memberId=${id}`);
    };

    const paginationHandler = (e: T, value: number) => {
        setSearchFilter({ ...searchFilter, page: value });
    };

    if (device === 'mobile') return <div>COMMUNITY DETAIL PAGE MOBILE</div>;

    return (
        <div id="community-detail-page">
            <div className="container">
                {/* ── Tab Bar ── */}
                <Stack className="tab-bar">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            className={`tab-pill ${articleCategory === tab.value ? 'active' : ''}`}
                            onClick={() => tabChangeHandler(tab.value)}
                        >
                            {tab.label}
                        </button>
                    ))}
                    <Button
                        className="write-btn"
                        onClick={() => router.push({ pathname: '/mypage', query: { category: 'writeArticle' } })}
                    >
                        + Write
                    </Button>
                </Stack>

                {/* ── Article Card ── */}
                <Stack className="article-card">
                    {/* Header */}
                    <Stack className="article-header">
                        <Stack className="article-meta-left">
                            <Typography className="article-category">{articleCategory}</Typography>
                            <Typography className="article-title">{boardArticle?.articleTitle}</Typography>
                            <Stack className="author-row">
                                <img
                                    src={memberImage}
                                    alt=""
                                    className="author-img"
                                    onClick={() => goMemberPage(boardArticle?.memberData?._id)}
                                />
                                <Typography className="author-nick" onClick={() => goMemberPage(boardArticle?.memberData?._id)}>
                                    {boardArticle?.memberData?.memberNick}
                                </Typography>
                                <span className="dot">·</span>
                                <Moment className="article-date" format={'MMM DD, YYYY'}>
                                    {boardArticle?.createdAt}
                                </Moment>
                            </Stack>
                        </Stack>
                        <Stack className="article-stats">
                            <Stack className="stat-item" onClick={() => likeBoArticleHandler(user, boardArticle?._id)}>
                                {boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite
                                    ? <ThumbUpAltIcon className="liked" />
                                    : <ThumbUpOffAltIcon />}
                                <Typography>{boardArticle?.articleLikes}</Typography>
                            </Stack>
                            <Stack className="stat-item">
                                <VisibilityIcon />
                                <Typography>{boardArticle?.articleViews}</Typography>
                            </Stack>
                            <Stack className="stat-item">
                                {total > 0 ? <ChatIcon /> : <ChatBubbleOutlineRoundedIcon />}
                                <Typography>{total}</Typography>
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* Content */}
                    <Stack className="article-content">
                        <ToastViewerComponent markdown={boardArticle?.articleContent} className={'ytb_play'} />
                    </Stack>

                    {/* Like button */}
                    <Stack className="article-like-row">
                        <button
                            className={`like-btn ${boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? 'liked' : ''}`}
                            onClick={() => likeBoArticleHandler(user, boardArticle?._id)}
                        >
                            {boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite
                                ? <ThumbUpAltIcon />
                                : <ThumbUpOffAltIcon />}
                            <span>{boardArticle?.articleLikes}</span>
                        </button>
                    </Stack>
                </Stack>

                {/* ── Comments Section ── */}
                <Stack className="comments-section">
                    <Typography className="comments-heading">Comments ({total})</Typography>

                    {/* Leave comment */}
                    <Stack className="comment-input-box">
                        <input
                            type="text"
                            placeholder="Leave a comment..."
                            value={comment}
                            onChange={(e) => {
                                if (e.target.value.length > 100) return;
                                setWordsCnt(e.target.value.length);
                                setComment(e.target.value);
                            }}
                        />
                        <Stack className="comment-footer">
                            <Typography className="word-count">{wordsCnt}/100</Typography>
                            <button className="submit-btn" onClick={creteCommentHandler}>Comment</button>
                        </Stack>
                    </Stack>





                    {/* Comments list */}
                    {comments?.map((commentData) => (
                        <Stack className="comment-item" key={commentData?._id}>
                            <Stack className="comment-author">
                                <img
                                    src={getCommentMemberImage(commentData?.memberData?.memberImage)}
                                    alt=""
                                    onClick={() => goMemberPage(commentData?.memberData?._id)}
                                />
                                <Stack className="comment-author-info">
                                    <Typography className="comment-nick" onClick={() => goMemberPage(commentData?.memberData?._id)}>
                                        {commentData?.memberData?.memberNick}
                                    </Typography>
                                    <Moment className="comment-date" format={'MMM DD, YYYY · HH:mm'}>
                                        {commentData?.createdAt}
                                    </Moment>
                                </Stack>
                                {(commentData?.memberId === user?._id || user?.memberType === 'ADMIN') && (
                                    <Stack className="comment-actions">
                                        <IconButton onClick={() => { setUpdatedCommentId(commentData?._id); updateButtonHandler(commentData?._id, CommentStatus.DELETE); }}>
                                            <DeleteForeverIcon />
                                        </IconButton>
                                        <IconButton onClick={() => { setUpdatedComment(commentData?.commentContent); setUpdatedCommentWordsCnt(commentData?.commentContent?.length); setUpdatedCommentId(commentData?._id); setOpenBackdrop(true); }}>
                                            <EditIcon />
                                        </IconButton>
                                        <Backdrop
                                            sx={{ top: '40%', right: '25%', left: '25%', width: '700px', height: 'fit-content', borderRadius: '12px', color: '#fff', zIndex: 999 }}
                                            open={openBackdrop}
                                        >
                                            <Stack sx={{ width: '100%', background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', gap: '16px', borderRadius: '12px' }}>
                                                <Typography variant="h6" color={'rgba(255,255,255,0.7)'}>Update comment</Typography>
                                                <input
                                                    autoFocus
                                                    value={updatedComment}
                                                    onChange={(e) => { if (e.target.value.length > 100) return; setUpdatedCommentWordsCnt(e.target.value.length); setUpdatedComment(e.target.value); }}
                                                    type="text"
                                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', outline: 'none', height: '44px', padding: '0 14px', borderRadius: '8px', fontSize: '14px' }}
                                                />
                                                <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
                                                    <Typography variant="subtitle2" color={'rgba(255,255,255,0.4)'}>{updatedCommentWordsCnt}/100</Typography>
                                                    <Stack flexDirection={'row'} gap={'10px'}>
                                                        <Button variant="outlined" sx={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => { setOpenBackdrop(false); setUpdatedComment(''); setUpdatedCommentWordsCnt(0); }}>Cancel</Button>
                                                        <Button variant="contained" sx={{ background: '#fff', color: '#0f1117' }} onClick={() => updateButtonHandler(updatedCommentId, undefined)}>Update</Button>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Backdrop>
                                    </Stack>
                                )}
                            </Stack>
                            <Typography className="comment-content">{commentData?.commentContent}</Typography>
                        </Stack>
                    ))}




                    {total > 0 && (
                        <Stack className="pagination-box">
                            <Pagination
                                count={Math.ceil(total / searchFilter.limit) || 1}
                                page={searchFilter.page}
                                shape="circular"
                                color="primary"
                                onChange={paginationHandler}
                            />
                        </Stack>
                    )}
                </Stack>
            </div>
        </div>
    );
};

CommunityDetail.defaultProps = {
    initialInput: {
        page: 1,
        limit: 5,
        sort: 'createdAt',
        direction: 'DESC',
        search: { commentRefId: '' },
    },
};

export default withLayoutBasic(CommunityDetail);