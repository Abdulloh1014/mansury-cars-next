import React, { useEffect, useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
// Swiper komponentlarini import qilish
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

interface EventData {
    eventTitle: string;
    city: string;
    description: string;
    imageSrc: string;
    instaLink: string;
}

const eventsData: EventData[] = [
    { eventTitle: 'P1', city: 'Incheon', description: 'Desc', imageSrc: '/img/events/rolls.webp', instaLink: 'https://www.instagram.com/p/DU5tkPkiMcq/?img_index=1/' },
    { eventTitle: 'P2', city: 'Seoul', description: 'Desc', imageSrc: '/img/events/ikki.webp', instaLink: 'https://www.instagram.com/p/DTfoVWBiHTl/?img_index=6/' },
    { eventTitle: 'P3', city: 'Daegu', description: 'Desc', imageSrc: '/img/events/uch.webp', instaLink: 'https://www.instagram.com/p/DVQz5DhiDYW/?img_index=12/' },
    { eventTitle: 'P4', city: 'Daegu', description: 'Desc', imageSrc: '/img/events/uch2.webp', instaLink: 'https://www.instagram.com/p/DSm2JXxiPIL/?hl=cs&img_index=4/' },
    { eventTitle: 'P5', city: 'Busan', description: 'Desc', imageSrc: '/img/events/tort.webp', instaLink: 'https://www.instagram.com/p/DAdvvhNof_q/?hl=cs&img_index=12/' },
    { eventTitle: 'P6', city: 'Busan', description: 'Desc', imageSrc: '/img/events/besh.webp', instaLink: 'https://www.instagram.com/p/DEXUTu4hZs3/?img_index=1/' },
    { eventTitle: 'P7', city: 'Busan', description: 'Desc', imageSrc: '/img/events/olti.webp', instaLink: 'https://www.instagram.com/p/DT29j-LDsK1/?hl=cs&img_index=1/' },
];

const EventCard = ({ event }: { event: EventData }) => {
    return (
        <a href={event.instaLink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
            <Stack
                className="event-card"
                style={{
                    backgroundImage: `url(${event?.imageSrc})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '500px', // Balandlikni shu yerda o'zgartirasiz
                    width: '100%',
                    borderRadius: '4px'
                }}
            />
        </a>
    );
};

const Events = () => {
    const device = useDeviceDetect();
    const [isMounted, setIsMounted] = useState(false);

    // Hydration xatosini oldini olish uchun useEffect
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Serverda hech narsa render qilmaymiz, faqat Client (brauzer) da chiqadi
    if (!isMounted) return null;

    return (
        <Stack className={'events'}>
            <Stack className={'container'}>
                <Stack className={'info-box'} >
                    <Box style={{ marginLeft: '150px' }} component={'div'} className={'left'} >
                        <span className={'white'}>FOLLOW US</span>
                        <p className={'white'}>Instagram @mansory</p>
                    </Box>
                </Stack>
                
                <Box className={'card-wrapper'} sx={{ width: '100%'}}>
                    <Swiper
                        modules={[Autoplay, Navigation]}
                        spaceBetween={10} 
                        slidesPerView={device === 'mobile' ? 1 : 5} // Qurilmaga qarab moslashish
                        loop={true}
                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        navigation={true}
                        breakpoints={{
                            320: { slidesPerView: 1 },
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 5 }, // desktopda 5 ta rasm
                        }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {eventsData.map((event, index) => (
                            <SwiperSlide key={`${event.eventTitle}-${index}`}>
                                <EventCard event={event} />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </Stack>
        </Stack>
    );
};

export default Events;