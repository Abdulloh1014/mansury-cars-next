import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Avatar, Box, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { useRouter } from 'next/router';
import ScrollableFeed from 'react-scrollable-feed';
import { RippleBadge } from '../../scss/MaterialTheme/styled';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../apollo/store';
import { Member } from '../types/member/member';
import { Messages, REACT_APP_API_URL } from '../config';
import { sweetErrorAlert } from '../sweetAlert';

const EMOJIS = ['😊','👍','🚗','🔥','❤️','😂','💯','🤝','⚡','✅','🎯','💰'];

interface MessagePayload {
	event: string;
	text: string;
	memberData: Member;
}

interface InfoPayload {
	event: string;
	totalClients: number;
	memberData: Member;
	action: string;
}

const Chat = () => {
	const chatContentRef = useRef<HTMLDivElement>(null);
	const fileRef = useRef<HTMLInputElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const [messagesList, setMessagesList] = useState<MessagePayload[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<number>(0);
	const [messageInput, setMessageInput] = useState<string>('');
	const [open, setOpen] = useState(false);
	const [openButton, setOpenButton] = useState(false);
	const [showEmoji, setShowEmoji] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [reactions, setReactions] = useState<Record<number, Record<string, number>>>({});
	const [activeReactions, setActiveReactions] = useState<Record<number, string>>({});
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const socket = useReactiveVar(socketVar);

	/** LIFECYCLES **/
	useEffect(() => {
		socket.onmessage = (msg) => {
			const data = JSON.parse(msg.data);
			switch (data.event) {
				case 'info':
					const newInfo: InfoPayload = data;
					setOnlineUsers(newInfo.totalClients);
					break;
				case 'getMessages':
					const list: MessagePayload[] = data.list;
					setMessagesList(list);
					break;
				case 'message':
					const newMessage: MessagePayload = data;
					setMessagesList((prev) => [...prev, newMessage]);
					break;
			}
		};
	}, [socket, messagesList]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setOpenButton(true);
		}, 100);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		setOpenButton(false);
	}, [router.pathname]);

	/** HANDLERS **/
	const handleOpenChat = () => {
		setOpen((prev) => !prev);
		setShowEmoji(false);
	};

	const getInputMessageHandler = useCallback((e: any) => {
		setMessageInput(e.target.value);
	}, []);

	const getKeyHandler = (e: any) => {
		try {
			if (e.key === 'Enter') onClickHandler();
		} catch (err: any) {
			console.log(err);
		}
	};

	const onClickHandler = () => {
		if (!messageInput && !imageFile) {
			sweetErrorAlert(Messages.error4);
		} else {
			socket.send(JSON.stringify({ event: 'message', data: messageInput }));
			setMessageInput('');
			setImageFile(null);
			setShowEmoji(false);
		}
	};

	const addEmoji = (emoji: string) => {
		setMessageInput((prev) => prev + emoji);
		setShowEmoji(false);
		inputRef.current?.focus();
	};

	const toggleReaction = (index: number, emoji: string) => {
		setReactions((prev) => {
			const msgReacts = { ...(prev[index] ?? {}) };
			const current = activeReactions[index];
			if (current === emoji) {
				msgReacts[emoji] = Math.max(0, (msgReacts[emoji] ?? 1) - 1);
				setActiveReactions((a) => ({ ...a, [index]: '' }));
			} else {
				if (current) msgReacts[current] = Math.max(0, (msgReacts[current] ?? 1) - 1);
				msgReacts[emoji] = (msgReacts[emoji] ?? 0) + 1;
				setActiveReactions((a) => ({ ...a, [index]: emoji }));
			}
			return { ...prev, [index]: msgReacts };
		});
	};

	const getTime = () => {
		const now = new Date();
		return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
	};

	return (
		<Stack className="chatting">
			{openButton ? (
				<button className="chat-button" onClick={handleOpenChat}>
					{open ? <CloseFullscreenIcon /> : <MarkChatUnreadIcon />}
				</button>
			) : null}

			<Stack className={`chat-frame ${open ? 'open' : ''}`}>
				{/* TOP */}
				<Box className={'chat-top'} component={'div'}>
					<div className="chat-title">
						<span className="chat-dot" />
						Online Chat
					</div>
					<RippleBadge style={{ margin: '-18px 0 0 21px' }} badgeContent={onlineUsers} />
				</Box>

				{/* MESSAGES */}
				<Box className={'chat-content'} id="chat-content" ref={chatContentRef} component={'div'}>
					<ScrollableFeed>
						<Stack className={'chat-main'}>
							<Box flexDirection={'row'} style={{ display: 'flex' }} sx={{ m: '10px 0px' }} component={'div'}>
								<div className={'welcome'}>Welcome to Mansury Live Chat!</div>
							</Box>

							{messagesList.map((ele: MessagePayload, index: number) => {
								const { text, memberData } = ele;
								const memberImage = memberData?.memberImage
									? `${REACT_APP_API_URL}/${memberData.memberImage}`
									: '/img/profile/defaultUser.svg';
								const isMe = memberData?._id === user?._id;
								const msgReacts = reactions[index] ?? {};

								return isMe ? (
									<Box
										key={index}
										component={'div'}
										flexDirection={'row'}
										style={{ display: 'flex' }}
										alignItems={'flex-end'}
										justifyContent={'flex-end'}
										sx={{ m: '6px 0px' }}
									>
										<div className="msg-wrap-right">
											<div className={'msg-right'}>{text}</div>
											<div className="msg-meta">
												<span className="msg-time">{getTime()}</span>
												<DoneAllIcon style={{ fontSize: 13, color: '#1bffb4' }} />
											</div>
											<div className="msg-reactions">
												{['👍', '❤️', '🔥'].map((emoji) => (
													<button
														key={emoji}
														className={`react-btn ${activeReactions[index] === emoji ? 'active' : ''}`}
														onClick={() => toggleReaction(index, emoji)}
													>
														{emoji} {msgReacts[emoji] ? <span>{msgReacts[emoji]}</span> : null}
													</button>
												))}
											</div>
										</div>
									</Box>
								) : (
									<Box
										key={index}
										flexDirection={'row'}
										style={{ display: 'flex' }}
										sx={{ m: '6px 0px' }}
										component={'div'}
									>
										<Avatar alt={'user'} src={memberImage} sx={{ width: 28, height: 28 }} />
										<div className="msg-wrap-left">
											<div className={'msg-left'}>{text}</div>
											<div className="msg-meta">
												<span className="msg-time">{getTime()}</span>
											</div>
											<div className="msg-reactions">
												{['👍', '❤️', '🔥'].map((emoji) => (
													<button
														key={emoji}
														className={`react-btn ${activeReactions[index] === emoji ? 'active' : ''}`}
														onClick={() => toggleReaction(index, emoji)}
													>
														{emoji} {msgReacts[emoji] ? <span>{msgReacts[emoji]}</span> : null}
													</button>
												))}
											</div>
										</div>
									</Box>
								);
							})}

							{/* Typing indicator */}
							<div className="typing-indicator">
								<span /><span /><span />
							</div>
						</Stack>
					</ScrollableFeed>
				</Box>

				{/* IMAGE PREVIEW */}
				{imageFile && (
					<div className="img-preview-bar">
						<span>📎 {imageFile.name}</span>
						<button onClick={() => setImageFile(null)}>×</button>
					</div>
				)}

				{/* EMOJI PANEL */}
				{showEmoji && (
					<div className="emoji-panel">
						{EMOJIS.map((e) => (
							<span key={e} className="emoji-item" onClick={() => addEmoji(e)}>{e}</span>
						))}
					</div>
				)}

				{/* TOOLBAR */}
				<div className="chat-toolbar">
					<button className="tool-btn" onClick={() => setShowEmoji((v) => !v)}>
						<EmojiEmotionsOutlinedIcon style={{ fontSize: 18 }} />
					</button>
					<button className="tool-btn" onClick={() => fileRef.current?.click()}>
						<ImageOutlinedIcon style={{ fontSize: 18 }} />
					</button>
					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						style={{ display: 'none' }}
						onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
					/>
				</div>

				{/* BOTTOM */}
				<Box className={'chat-bott'} component={'div'}>
					<input
						ref={inputRef}
						type={'text'}
						name={'message'}
						className={'msg-input'}
						placeholder={'Type message...'}
						value={messageInput}
						onChange={getInputMessageHandler}
						onKeyDown={getKeyHandler}
					/>
					<button className={'send-msg-btn'} onClick={onClickHandler}>
						<SendIcon style={{ color: '#0f1117', fontSize: 18 }} />
					</button>
				</Box>
			</Stack>
		</Stack>
	);
};

export default Chat;