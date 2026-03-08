import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

const Notice = () => {
	const device = useDeviceDetect();
	const [hoveredId, setHoveredId] = useState<number | null>(null);

	const data = [
		{ no: 1, event: true, title: 'Register to use and get exclusive discounts on premium cars', date: '01.03.2024', category: 'Event' },
		{ no: 2, event: false, title: "It's absolutely free to upload and trade cars on our platform", date: '31.03.2024', category: 'General' },
		{ no: 3, event: false, title: 'New verification system launched for agent accounts', date: '15.04.2024', category: 'Update' },
		{ no: 4, event: true, title: 'Spring Sale: Up to 20% off on selected luxury vehicles', date: '20.04.2024', category: 'Event' },
		{ no: 5, event: false, title: 'Updated terms of service effective from May 2024', date: '28.04.2024', category: 'Notice' },
	];

	if (device === 'mobile') {
		return <div>NOTICE MOBILE</div>;
	} else {
		return (
			<Stack className={'notice-content'}>
				<span className={'title'}>Notice Board</span>
				<Stack
					className={'main'}
					style={{
						border: '1px solid rgba(0, 200, 150, 0.08)',
						borderRadius: '16px',
						overflow: 'hidden',
						background: 'rgba(0, 200, 150, 0.02)',
					}}
				>
					<Box
						component={'div'}
						className={'top'}
						style={{
							padding: '18px 30px',
							display: 'grid',
							gridTemplateColumns: '60px 120px 1fr 130px 40px',
							alignItems: 'center',
							background: 'rgba(0, 200, 150, 0.06)',
							borderBottom: '1px solid rgba(0, 200, 150, 0.12)',
						}}
					>
						<span style={{ color: '#00c896', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>#</span>
						<span style={{ color: '#00c896', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Category</span>
						<span style={{ color: '#00c896', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Title</span>
						<span style={{ color: '#00c896', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Date</span>
						<span></span>
					</Box>

					<Stack className={'bottom'} style={{ display: 'flex', flexDirection: 'column' }}>
						{data.map((ele: any, index: number) => (
							<div
								key={ele.no}
								style={{
									padding: '20px 30px',
									display: 'grid',
									gridTemplateColumns: '60px 120px 1fr 130px 40px',
									alignItems: 'center',
									borderBottom: index < data.length - 1 ? '1px solid rgba(0, 200, 150, 0.05)' : 'none',
									cursor: 'pointer',
									animationDelay: `${index * 0.08}s`,
									backgroundColor: hoveredId === ele.no
										? 'rgba(0, 200, 150, 0.07)'
										: ele?.event
										? 'rgba(0, 200, 150, 0.04)'
										: '#0d1f1f',
									transform: hoveredId === ele.no ? 'translateX(4px)' : 'translateX(0)',
									transition: 'all 0.3s ease',
									position: 'relative',
								}}
								onMouseEnter={() => setHoveredId(ele.no)}
								onMouseLeave={() => setHoveredId(null)}
							>
								<span style={{ color: '#2a4a3a', fontSize: '13px', fontWeight: 500 }}>{ele.no}</span>

								{ele?.event ? (
									<div style={{
										padding: '4px 12px',
										borderRadius: '50px',
										fontSize: '11px',
										fontWeight: 700,
										letterSpacing: '0.5px',
										textTransform: 'uppercase',
										width: 'fit-content',
										background: 'rgba(0, 200, 150, 0.12)',
										color: '#00c896',
										border: '1px solid rgba(0, 200, 150, 0.3)',
									}}>Event</div>
								) : (
									<div style={{
										padding: '4px 12px',
										borderRadius: '50px',
										fontSize: '11px',
										fontWeight: 700,
										letterSpacing: '0.5px',
										textTransform: 'uppercase',
										width: 'fit-content',
										background: 'rgba(255,255,255,0.04)',
										color: '#4a7a6a',
										border: '1px solid rgba(255,255,255,0.08)',
									}}>{ele.category}</div>
								)}

								<span style={{
									color: hoveredId === ele.no ? '#00c896' : '#a0c4b8',
									fontSize: '15px',
									fontWeight: 400,
									lineHeight: 1.5,
									transition: 'color 0.3s ease',
									paddingRight: '20px',
								}}>{ele.title}</span>

								<span style={{ color: '#3a6a5a', fontSize: '13px', fontWeight: 400 }}>{ele.date}</span>

								<span style={{
									color: '#00c896',
									fontSize: '18px',
									opacity: hoveredId === ele.no ? 1 : 0,
									transition: 'all 0.3s ease',
									transform: hoveredId === ele.no ? 'translateX(4px)' : 'translateX(0)',
								}}>→</span>
							</div>
						))}
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Notice;