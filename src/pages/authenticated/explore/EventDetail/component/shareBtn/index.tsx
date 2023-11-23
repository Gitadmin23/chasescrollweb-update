// import React from 'react'
import { useState } from 'react'
import { LuShare2 } from 'react-icons/lu'
import OverlayWrapper from '../../../../../../components/OverlayWrapper'
import CopyButtton from './CopyButton'
import {
    EmailShareButton,
    FacebookShareButton,
    LinkedinShareButton,
    // MailruShareButton,
    WhatsappShareButton,
} from "react-share"; 
import SendMesageModal from './SendMesageModal';

interface Props {
    id: any
}

function ShareBtn(props: Props) {
    const { id } = props
    // VITE_BASE_URL
    const url_link = import.meta.env.VITE_DOMAIN
    const [showModal, setShowModal] = useState(false);
    const [share, setShare] = useState(false); 

    return (
        <>
            <SendMesageModal id={id} isOpen={share} onClose={() => setShare(false)} />
            <button onClick={() => setShowModal(true)} className=' flex items-center font-medium text-[20px] text-[#3C41F0] gap-2 ' >
                Share
                <div className=' lg:flex hidden ' > 
                    <LuShare2 size={24} color="#3C41F0" />
                </div>
                <div className=' lg:hidden ' > 
                    <LuShare2 size={20} color="#3C41F0" />
                </div>
            </button>
            {showModal && (
                <OverlayWrapper handleClose={setShowModal}>
                    <div className=' w-[475px] rounded-2xl  py-7 px-8 bg-white ' >

                        <div className='relative flex w-full ' >
                            <div className=' absolute inset-x-0 flex justify-center ' >
                                <p className=' font-medium text-[20px] text-center' >{"Share"}</p>
                            </div>
                            <button className=' ml-auto z-10 ' onClick={() => setShowModal(false)} >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g id="iconoir:cancel">
                                        <path id="Vector" d="M6.75781 17.243L12.0008 12L17.2438 17.243M17.2438 6.75699L11.9998 12L6.75781 6.75699" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                </svg>
                            </button>
                        </div>
                        <div className=' w-full ' >
                            <p className=' text-center leading-[18px] text-[#121212CC] mt-4 ' >Spread the word about our upcoming event by sharing a custom link with your friends and colleagues.</p>
                            <p className=' text-[#667085] text-sm font-medium mt-6 mb-1 ' >Event link</p>
                            <CopyButtton text={url_link + "event/" + id} />
                            <p className=' py-5 text-center ' >or</p>
                            <div className=' w-full flex justify-evenly ' >
                                <WhatsappShareButton
                                    url={url_link + "event/" + id}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 40.6875C31.6482 40.6875 39.875 32.4607 39.875 22.3125C39.875 12.1643 31.6482 3.9375 21.5 3.9375C11.3518 3.9375 3.125 12.1643 3.125 22.3125C3.125 25.608 3.99256 28.7009 5.51175 31.3753L3.125 40.6875L12.7258 38.4612C15.3331 39.8809 18.3223 40.6875 21.5 40.6875ZM21.5 37.8606C30.087 37.8606 37.0481 30.8995 37.0481 22.3125C37.0481 13.7255 30.087 6.76442 21.5 6.76442C12.913 6.76442 5.95192 13.7255 5.95192 22.3125C5.95192 25.628 6.98966 28.701 8.75804 31.2247L7.36538 36.4471L12.6799 35.1185C15.186 36.8479 18.2248 37.8606 21.5 37.8606Z" fill="#BFC8D0" />
                                        <path d="M37.25 21C37.25 29.6985 30.1985 36.75 21.5 36.75C18.1822 36.75 15.104 35.7241 12.5654 33.9723L7.18182 35.3182L8.59256 30.0279C6.80121 27.4715 5.75 24.3585 5.75 21C5.75 12.3015 12.8015 5.25 21.5 5.25C30.1985 5.25 37.25 12.3015 37.25 21Z" fill="url(#paint0_linear_1180_46679)" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 39.375C31.6482 39.375 39.875 31.1482 39.875 21C39.875 10.8518 31.6482 2.625 21.5 2.625C11.3518 2.625 3.125 10.8518 3.125 21C3.125 24.2955 3.99256 27.3884 5.51175 30.0628L3.125 39.375L12.7258 37.1487C15.3331 38.5684 18.3223 39.375 21.5 39.375ZM21.5 36.5481C30.087 36.5481 37.0481 29.587 37.0481 21C37.0481 12.413 30.087 5.45192 21.5 5.45192C12.913 5.45192 5.95192 12.413 5.95192 21C5.95192 24.3155 6.98966 27.3885 8.75804 29.9122L7.36538 35.1346L12.6799 33.806C15.186 35.5354 18.2248 36.5481 21.5 36.5481Z" fill="white" />
                                        <path d="M16.9063 12.4688C16.4694 11.5912 15.7992 11.6689 15.1221 11.6689C13.9121 11.6689 12.0254 13.1183 12.0254 15.8157C12.0254 18.0264 12.9995 20.4463 16.282 24.0663C19.4499 27.5599 23.6123 29.3671 27.0679 29.3056C30.5235 29.2441 31.2344 26.2704 31.2344 25.2662C31.2344 24.8211 30.9582 24.599 30.7679 24.5387C29.5903 23.9735 27.4185 22.9205 26.9243 22.7227C26.4302 22.5248 26.1721 22.7924 26.0117 22.938C25.5636 23.3651 24.6753 24.6237 24.3711 24.9068C24.067 25.1899 23.6135 25.0466 23.4248 24.9396C22.7304 24.6609 20.8476 23.8234 19.3468 22.3686C17.4907 20.5694 17.3818 19.9503 17.0321 19.3993C16.7524 18.9585 16.9577 18.688 17.0601 18.5698C17.46 18.1084 18.0122 17.396 18.2598 17.042C18.5074 16.688 18.3108 16.1505 18.1929 15.8157C17.6856 14.376 17.2558 13.1708 16.9063 12.4688Z" fill="white" />
                                        <defs>
                                            <linearGradient id="paint0_linear_1180_46679" x1="35.2812" y1="9.1875" x2="5.75" y2="36.75" gradientUnits="userSpaceOnUse">
                                                <stop stop-color="#5BD066" />
                                                <stop offset="1" stop-color="#27B43E" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </WhatsappShareButton>

                                <FacebookShareButton
                                    url={url_link + "event/" + id}
                                    quote={'Dummy text!'}
                                    hashtag="#muo"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                                        <circle cx="21.5" cy="21" r="18.375" fill="url(#paint0_linear_1180_46680)" />
                                        <path d="M28.343 26.6195L29.1592 21.4333H24.0531V18.0692C24.0531 16.65 24.7651 15.2658 27.0521 15.2658H29.375V10.8504C29.375 10.8504 27.2678 10.5 25.2541 10.5C21.047 10.5 18.2997 12.9845 18.2997 17.4805V21.4333H13.625V26.6195H18.2997V39.1578C19.2382 39.3014 20.1983 39.375 21.1764 39.375C22.1545 39.375 23.1146 39.3014 24.0531 39.1578V26.6195H28.343Z" fill="white" />
                                        <defs>
                                            <linearGradient id="paint0_linear_1180_46680" x1="21.5" y1="2.625" x2="21.5" y2="39.266" gradientUnits="userSpaceOnUse">
                                                <stop stop-color="#18ACFE" />
                                                <stop offset="1" stop-color="#0163E0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </FacebookShareButton>
                                <img onClick={() => setShare(true)} src='/logoicon.png' role='button' alt='log' />
                                <LinkedinShareButton
                                    url={url_link + "event/" + id} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                                        <rect x="3.125" y="2.625" width="36.75" height="36.75" rx="18.375" fill="#0B83ED" />
                                        <path d="M17.0619 12.7209C17.0619 13.9475 15.9987 14.9419 14.6872 14.9419C13.3757 14.9419 12.3125 13.9475 12.3125 12.7209C12.3125 11.4944 13.3757 10.5 14.6872 10.5C15.9987 10.5 17.0619 11.4944 17.0619 12.7209Z" fill="white" />
                                        <path d="M12.6372 16.5744H16.6965V28.875H12.6372V16.5744Z" fill="white" />
                                        <path d="M23.232 16.5744H19.1727V28.875H23.232C23.232 28.875 23.232 25.0026 23.232 22.5814C23.232 21.1281 23.7282 19.6685 25.7081 19.6685C27.9457 19.6685 27.9322 21.5703 27.9218 23.0437C27.9082 24.9696 27.9407 26.9349 27.9407 28.875H32V22.383C31.9656 18.2377 30.8855 16.3276 27.3318 16.3276C25.2215 16.3276 23.9133 17.2857 23.232 18.1525V16.5744Z" fill="white" />
                                    </svg>
                                </LinkedinShareButton>
                                <svg xmlns="http://www.w3.org/2000/svg" width="43" height="42" viewBox="0 0 43 42" fill="none">
                                    <rect x="3.125" y="2.625" width="36.75" height="36.75" rx="6" fill="url(#paint0_radial_1180_46682)" />
                                    <path d="M3.125 21C3.125 10.8518 11.3518 2.625 21.5 2.625C31.6482 2.625 39.875 10.8518 39.875 21C39.875 31.1482 31.6482 39.375 21.5 39.375C11.3518 39.375 3.125 31.1482 3.125 21Z" fill="url(#paint1_radial_1180_46682)" />
                                    <rect x="3.125" y="2.625" width="36.75" height="36.75" rx="18.375" fill="url(#paint2_radial_1180_46682)" />
                                    <path d="M30.6875 13.7812C30.6875 14.8686 29.8061 15.75 28.7188 15.75C27.6314 15.75 26.75 14.8686 26.75 13.7812C26.75 12.6939 27.6314 11.8125 28.7188 11.8125C29.8061 11.8125 30.6875 12.6939 30.6875 13.7812Z" fill="white" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.5 27.5625C25.1244 27.5625 28.0625 24.6244 28.0625 21C28.0625 17.3756 25.1244 14.4375 21.5 14.4375C17.8756 14.4375 14.9375 17.3756 14.9375 21C14.9375 24.6244 17.8756 27.5625 21.5 27.5625ZM21.5 24.9375C23.6746 24.9375 25.4375 23.1746 25.4375 21C25.4375 18.8254 23.6746 17.0625 21.5 17.0625C19.3254 17.0625 17.5625 18.8254 17.5625 21C17.5625 23.1746 19.3254 24.9375 21.5 24.9375Z" fill="white" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.375 20.475C8.375 16.0646 8.375 13.8594 9.23332 12.1748C9.98833 10.693 11.193 9.48833 12.6748 8.73332C14.3594 7.875 16.5646 7.875 20.975 7.875H22.025C26.4354 7.875 28.6406 7.875 30.3252 8.73332C31.807 9.48833 33.0117 10.693 33.7667 12.1748C34.625 13.8594 34.625 16.0646 34.625 20.475V21.525C34.625 25.9354 34.625 28.1406 33.7667 29.8252C33.0117 31.307 31.807 32.5117 30.3252 33.2667C28.6406 34.125 26.4354 34.125 22.025 34.125H20.975C16.5646 34.125 14.3594 34.125 12.6748 33.2667C11.193 32.5117 9.98833 31.307 9.23332 29.8252C8.375 28.1406 8.375 25.9354 8.375 21.525V20.475ZM20.975 10.5H22.025C24.2735 10.5 25.802 10.502 26.9835 10.5986C28.1344 10.6926 28.7229 10.863 29.1334 11.0722C30.1213 11.5756 30.9244 12.3787 31.4278 13.3665C31.637 13.7771 31.8074 14.3656 31.9014 15.5165C31.998 16.698 32 18.2265 32 20.475V21.525C32 23.7735 31.998 25.302 31.9014 26.4835C31.8074 27.6344 31.637 28.2229 31.4278 28.6334C30.9244 29.6213 30.1213 30.4244 29.1334 30.9278C28.7229 31.137 28.1344 31.3074 26.9835 31.4014C25.802 31.498 24.2735 31.5 22.025 31.5H20.975C18.7265 31.5 17.198 31.498 16.0165 31.4014C14.8656 31.3074 14.2771 31.137 13.8665 30.9278C12.8787 30.4244 12.0756 29.6213 11.5722 28.6334C11.363 28.2229 11.1926 27.6344 11.0986 26.4835C11.002 25.302 11 23.7735 11 21.525V20.475C11 18.2265 11.002 16.698 11.0986 15.5165C11.1926 14.3656 11.363 13.7771 11.5722 13.3665C12.0756 12.3787 12.8787 11.5756 13.8665 11.0722C14.2771 10.863 14.8656 10.6926 16.0165 10.5986C17.198 10.502 18.7265 10.5 20.975 10.5Z" fill="white" />
                                    <defs>
                                        <radialGradient id="paint0_radial_1180_46682" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16.25 30.1875) rotate(-55.3758) scale(33.4945)">
                                            <stop stop-color="#B13589" />
                                            <stop offset="0.79309" stop-color="#C62F94" />
                                            <stop offset="1" stop-color="#8A3AC8" />
                                        </radialGradient>
                                        <radialGradient id="paint1_radial_1180_46682" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(14.9375 40.6875) rotate(-65.1363) scale(29.6549)">
                                            <stop stop-color="#E0E8B7" />
                                            <stop offset="0.444662" stop-color="#FB8A2E" />
                                            <stop offset="0.71474" stop-color="#E2425C" />
                                            <stop offset="1" stop-color="#E2425C" stop-opacity="0" />
                                        </radialGradient>
                                        <radialGradient id="paint2_radial_1180_46682" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(1.15625 3.9375) rotate(-8.1301) scale(51.0443 10.9178)">
                                            <stop offset="0.156701" stop-color="#406ADC" />
                                            <stop offset="0.467799" stop-color="#6A45BE" />
                                            <stop offset="1" stop-color="#6A45BE" stop-opacity="0" />
                                        </radialGradient>
                                    </defs>
                                </svg>

                                <EmailShareButton url={url_link + "event/" + id} subject='ChaseScroll Event' >
                                    <svg width="43" height="42" viewBox="0 0 43 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g id="vuesax/outline/sms">
                                            <g id="sms">
                                                <path id="Vector" d="M30.25 37.1875H12.75C6.3625 37.1875 2.6875 33.5125 2.6875 27.125V14.875C2.6875 8.4875 6.3625 4.8125 12.75 4.8125H30.25C36.6375 4.8125 40.3125 8.4875 40.3125 14.875V27.125C40.3125 33.5125 36.6375 37.1875 30.25 37.1875ZM12.75 7.4375C7.745 7.4375 5.3125 9.87 5.3125 14.875V27.125C5.3125 32.13 7.745 34.5625 12.75 34.5625H30.25C35.255 34.5625 37.6875 32.13 37.6875 27.125V14.875C37.6875 9.87 35.255 7.4375 30.25 7.4375H12.75Z" fill="#1845C6" />
                                                <path id="Vector_2" d="M21.4999 22.5224C20.0299 22.5224 18.5424 22.0674 17.4049 21.1399L11.9274 16.765C11.3674 16.31 11.2624 15.4874 11.7174 14.9274C12.1724 14.3674 12.9949 14.2625 13.5549 14.7175L19.0323 19.0925C20.3623 20.16 22.6198 20.16 23.9498 19.0925L29.4274 14.7175C29.9874 14.2625 30.8274 14.3499 31.2649 14.9274C31.7199 15.4874 31.6324 16.3275 31.0549 16.765L25.5774 21.1399C24.4574 22.0674 22.9699 22.5224 21.4999 22.5224Z" fill="#1845C6" />
                                            </g>
                                        </g>
                                    </svg>
                                </EmailShareButton>
                            </div>
                        </div>
                    </div>
                </OverlayWrapper>
            )}
        </>
    )
}

export default ShareBtn
