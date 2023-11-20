// import { LuShare2 } from "react-icons/lu";
import UserImages from '../../../../components/exploreComponents/sharedComponent/userImages';
import { formatNumber } from '../../../../utils/helpers';
import { CaretLeftIcon, MessageIcon } from '../../../../components/Svgs';
import AddFriends from './component/addfriends';
import EventDate from './component/eventdate';
import SelectTicket from "./component/selectTicket";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../../hooks/useFetch";
import DownloadTicketModal from "../../../../components/explore/modals/DownloadTicketModal";
import TicketPaymentModal from "../../../../components/explore/modals/TicketPaymentModal";
import RefundPolicy from "../../../../components/explore/modals/RefundPolicy";
import SelectPaymentMethod from "../../../../components/explore/modals/SelectPaymentMethod";
import SelectPaymentOptions from "../../../../components/explore/modals/SelectPaymentOptions";
import Stripecomponent from "../../../../components/explore/Stripecomponent/Stripecomponent";
import { CREATE_TICKET, PAY_WITH_STRIPE } from "../../../../constants/endpoints.constant";
import { toast } from "react-toastify";
import { EVENT_TYPE, POLICY } from "../../../../constants";
import CONFIG from "../../../../config";
import EventLocation from "./component/eventLocation";
import ShareBtn from "./component/shareBtn";
import LoginModal from '../../../../components/explore/modals/LoginModal';

interface Props {
    banner: any,
    eventID: any,
    userBy: any,
    eventName: any,
    eventLogo: any,
    attendees: any,
    price: any,
    convener: any,
    timeAndDate: any,
    endtimeAndDate: any,
    location: any,
    locationType: any,
    about: any,
    isFree: any,
    currency: any,
    isOrganizer: any,
    isBought: any,
    minPrice: any,
    maxPrice: any,
    username: any,
    dataInfo: any,
    ticketBought: any,
    getData: any
    ticketInfo: any
}

function EventDetail(props: Props) {
    const {
        banner,
        eventID,
        userBy,
        eventName,
        eventLogo,
        // attendees,
        price,
        convener,
        timeAndDate,
        endtimeAndDate,
        location,
        locationType,
        about,
        isFree,
        currency,
        isOrganizer,
        isBought,
        minPrice,
        maxPrice,
        username,
        dataInfo,
        ticketBought,
        getData
    } = props

    const [selectedCategory, setSelectedCategory] = useState({} as any)
    const [proceedWithDownload, setProceedWithDownload] = useState(false)
    const [loading, setLoading] = useState(false)
    const [loginModal, setLoginModal] = useState(false)
    const [proceedWithPurchase, setProceedWithPurchase] = useState(false)
    const [showRefundPolicy, setShowRefundPolicy] = useState(false)
    const [showPaymentMethods, setShowPaymentMethods] = useState(false)
    const [showPaymentOptions, setShowPaymentOptions] = useState(false)
    const [showStripeForm, setShowStripeForm] = useState(false)
    const [ticketCount, setTicketCount] = useState(1)

    const { sendRequest: sendPaystackRequest, isLoading: paystackLoading }: any = useFetch()
    const { sendRequest: sendStripeRequest, isLoading: stripeLoading }: any = useFetch()
    const { sendRequest }: any = useFetch()
    const Paystack_key = import.meta.env.VITE_PAYSTACK_KEY

    const { token, setEventData, userId }: any = useAuth()
    // const isDisabled = !isFree || !selectedCategory?.ticketPrice
    const navigate = useNavigate()

    const toggleRefundPolicy = () => setShowRefundPolicy(state => !state)
    const viewTicket = () => setProceedWithDownload(state => !state)
    const togglePaymentOptions = () => setShowPaymentOptions(state => !state)
    const togglePaymentMethods = () => setShowPaymentMethods(state => !state)
    const buyTicket = () => setProceedWithPurchase(state => !state)
    const handleClose = () => {
        setProceedWithDownload(false)
        setProceedWithPurchase(false)
        setShowRefundPolicy(false)
        setShowPaymentMethods(false)
        setShowPaymentOptions(false)
    }

    const handlePaymentModal = () => {
        setShowPaymentOptions(false)
        setShowStripeForm(true)
    }

    const closeModal = () => {
        setShowStripeForm(false)
    }

    const [config, setConfig] = useState({
        email: "",
        amount: 0,
        reference: "",
        publicKey: Paystack_key,
    })

    const [configStripe, setConfigStripe] = useState({} as any)
    const [clientKey, setClientKey] = useState("")
    const [ticketinfo, setticketinfo] = useState({} as any)

    const [userInfo, setUserInfo] = useState({} as any)


    const fetchProfileInfo = async () => {
        const data = await sendRequest(
            "/user/publicprofile/" + userId,
            "GET",
            null,
            { Authorization: `Bearer ${token}` }
        )
        if (data) {
            setUserInfo(data)
        }
    }
    const getEventTicket = () => {

        sendRequest(
            `/events/get-users-tickets?userID=${userId}&eventID=${eventID}`,
            "GET",
            null,
            {
                Authorization: `Bearer ${token}`,
            }
        ).then((data: any) => {
            setticketinfo(data?.content)
        })
    }

    useEffect(() => {
        if (userId) {
            getEventTicket()
            fetchProfileInfo()
        }
    }, [getData])

    const payWithPaystack = async () => {
        sendPaystackRequest(
            CREATE_TICKET,
            "POST",
            {
                eventID,
                ticketType: selectedCategory?.ticketType,
                numberOfTickets: ticketCount
            },
            { Authorization: `Bearer ${token}` }
        ).then((data: any) => {
            if (data?.content?.orderTotal > 0) {
                setConfig({
                    email: data?.content?.email,
                    amount: (Number(data?.content?.orderTotal) * 100), //Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
                    publicKey: Paystack_key,
                    reference: data?.content?.orderCode
                });
            }
        })
    }

    const payWithStripe = () => {
        sendStripeRequest(
            CREATE_TICKET,
            "POST",
            {
                eventID,
                ticketType: selectedCategory?.ticketType,
                numberOfTickets: ticketCount
            },
            { Authorization: `Bearer ${token}` }
        ).then((data: any) => {
            console.log(data);
            
            if (data?.content?.orderTotal > 0) {

                setConfigStripe({
                    reference: data?.content?.orderId,
                    amount: data?.content?.orderTotal
                })
            }
            if (!data?.content?.orderId) {
                toast.error(data?.message)
            } else {
                sendStripeRequest(
                    `${PAY_WITH_STRIPE}?orderId=${data?.content?.orderId}`,
                    "POST",
                    null,
                    { Authorization: `Bearer ${token}` }
                ).then((response: any) => {
                    setClientKey(response?.gatewayReferenceID)
                    // setShowStripeForm(true)
                    // window.open(response?.checkout, "_blank");
                })
            }
        })
    }

    const PayForFreeEvent = () => {
        setLoading(true)
        sendStripeRequest(
            CREATE_TICKET,
            "POST",
            {
                eventID,
                ticketType: selectedCategory?.ticketType,
                numberOfTickets: ticketCount
            },
            { Authorization: `Bearer ${token}` }
        ).then((data: any) => {
            console.log(data);
            if (data) {
                toast.success("Successful")
                setLoading(false)
                buyTicket()
                getData()
            }
        })
    }

    const clickHandler = () => {
        setEventData(dataInfo)
        navigate("/event-dashboard")
    }

    const editHandler = () => {
        setEventData(dataInfo)
        navigate("/event/edit")
    }

    const closeLogin = () => {
        setLoginModal((prev) => !prev)
    }



    return (
        <div className=' w-full relative lg:pb-0 pb-24 ' >

            {loginModal && (
                <LoginModal modal={true} handleClose={closeLogin} />
            )}
            {proceedWithDownload && (
                <DownloadTicketModal
                    firstName={ticketinfo?.length > 0 ? ticketinfo[0]?.createdBy?.firstName : userInfo?.firstName}
                    lastName={ticketinfo?.length > 0 ? ticketinfo[0]?.createdBy?.lastName : userInfo?.lastName}
                    userName={ticketinfo?.length > 0 ? ticketinfo[0]?.createdBy?.firstName + " " + ticketinfo[0]?.createdBy?.lastName : userInfo?.firstName + " " + userInfo?.lastName}
                    banner={`${CONFIG.RESOURCE_URL}${banner}`}
                    length={ticketinfo?.length > 0 ? ticketinfo?.length : 1}
                    eventName={eventName}
                    location={location?.locationDetails}
                    currency={currency}
                    ticketFee={
                        (isFree)
                            ? EVENT_TYPE.free
                            : ticketinfo[0]?.boughtPrice
                    }
                    profile={`${ticketinfo?.length > 0 ? ticketinfo[0]?.createdBy?.data?.imgMain?.value : userInfo?.data?.imgMain?.value}`}
                    type={ticketinfo[0]?.ticketType}
                    convener={convener}
                    date={timeAndDate}
                    orderId={ticketinfo[0]?.id}
                    closeModal={viewTicket}
                    handleClose={handleClose}
                />
            )}
            {proceedWithPurchase && (
                <TicketPaymentModal
                    banner={`${CONFIG.RESOURCE_URL}${banner}`}
                    eventName={eventName}
                    eventLogo={`${CONFIG.RESOURCE_URL}${eventLogo}`}
                    convener={convener}
                    timeAndDate={timeAndDate}
                    location={location?.address}
                    ticketLeft={Number(selectedCategory?.totalNumberOfTickets) - Number(selectedCategory?.ticketsSold)}
                    about={about}
                    loading={loading}
                    toggleModal={buyTicket}
                    minticket={selectedCategory?.minTicketBuy}
                    maxticket={selectedCategory?.maxTicketBuy}
                    toggleRefundPolicy={toggleRefundPolicy}
                    ticketPrice={selectedCategory?.ticketPrice}
                    selectTicket={PayForFreeEvent}
                    categoryType={selectedCategory?.ticketType}
                    ticketCount={ticketCount}
                    setTicketCount={setTicketCount}
                    currency={currency}
                    handleClose={handleClose}
                />
            )}
            {showRefundPolicy && (
                <RefundPolicy
                    banner={`${CONFIG.RESOURCE_URL}${banner}`}
                    eventName={eventName}
                    location={location?.address}
                    policy={POLICY}
                    closeModal={toggleRefundPolicy}
                    goBack={buyTicket}
                    selectPaymentMethod={togglePaymentMethods}
                    handleClose={handleClose}
                />
            )}
            {showPaymentMethods && (
                <SelectPaymentMethod
                    closeModal={togglePaymentMethods}
                    goBack={toggleRefundPolicy}
                    togglePaymentOptions={togglePaymentOptions}
                    handleClose={handleClose}
                />
            )}
            {showPaymentOptions && (
                <SelectPaymentOptions
                    closeModal={togglePaymentOptions}
                    goBack={togglePaymentMethods}
                    payWithPaystack={payWithPaystack}
                    payWithStripe={payWithStripe}
                    handleClose={handleClose}
                    paystackLoading={paystackLoading}
                    stripeLoading={stripeLoading}
                    currency={currency}
                    client={clientKey}
                    config={config}
                    stripeform={handlePaymentModal}
                    stripeconfig={configStripe}
                    getData={getData}
                />
            )}
            {showStripeForm && (
                <Stripecomponent clientKey={clientKey} config={configStripe} closeModal={closeModal} getData={getData} />
            )}
            <div className=' w-full relative h-80 rounded-b-[16px] rounded-tl-[16px] ' >
                {userId && (
                    <>
                        {window.location.href?.includes("event/") && (
                            <button
                                onClick={() => navigate("/events")}
                                className="absolute top-9 z-20 left-2 p-2"
                            >
                                <CaretLeftIcon />
                            </button>
                        )}

                        {!window.location.href?.includes("event/") && (
                            <button
                                onClick={() => navigate(-1)}
                                className="absolute top-9 z-20 left-2 p-2"
                            >
                                <CaretLeftIcon />
                            </button>
                        )}
                    </>
                )} 
                <div className="backdrop-blur-sm absolute inset-0 px-3  -z-20 flex justify-center items-center rounded-b-[16px] rounded-tl-[16px] h-80">
                    <img
                        src={`${CONFIG.RESOURCE_URL}${banner}`}
                        alt="Blurred Image"
                        className="h-80  blur-md w-full object-cover mx-2 rounded-b-[16px] rounded-tl-[16px]"
                    />
                </div>
                <img
                    src={`${CONFIG.RESOURCE_URL}${banner}`}
                    alt="ticket banner"
                    className="w-full h-80 z-20 object-contain rounded-b-[16px] rounded-tl-[16px]"
                />
            </div>
            <div className=' w-full px-2 ' >
                <div className=' w-full mt-12 px-5 flex items-center justify-between ' >
                    <div>
                        <p className=' text-[24px] text-[#121212] font-bold  ' >{eventName}</p>
                        <p className=' text-[20px] text-[#3C41F0] font-medium ' >
                            {formatNumber(minPrice, currency === "USD" ? "$" : "₦")} - {formatNumber(maxPrice, currency === "USD" ? "$" : "₦")}
                        </p>
                    </div>
                    <ShareBtn id={eventID} />
                </div>
                <div className=' pb-2 border-b rounded-b-lg w-full flex mt-5 px-5 justify-between items-center ' >
                    <div className=' flex items-center gap-2' >
                        <UserImages data={dataInfo?.createdBy} size='20' />
                        <div className='' >
                            <p className=' font-medium text-[#121212] ' >{convener}</p>
                            <p className=' text-sm ' >@{username}</p>
                        </div>
                    </div>
                    {!isOrganizer && (
                        <div className=' flex items-center gap-2' >
                            <AddFriends data={dataInfo} userBy={userBy} />
                            <button className="p-2">
                                <MessageIcon />
                            </button>
                        </div>
                    )}
                </div>
                <div className=' w-full grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6 lg:gap-2' >
                    <EventDate name='Event Start date and time' date={timeAndDate} />
                    <EventDate name='Event End date and time' date={endtimeAndDate} />
                    {!isBought && (
                        <>
                            {!isOrganizer ? (
                                <SelectTicket ticket={price} currency={currency} setticket={setSelectedCategory} selectedticket={selectedCategory} />
                            ) : (
                                <div className=" w-full flex justify-center lg:flex-row flex-col items-center gap-3 pr-5" >
                                    <button onClick={() => clickHandler()} className=" w-full h-[49px] text-white font-semibold rounded-lg bg-chasescrollBlue text-sm " >My Dashboard</button>
                                    <button
                                        onClick={() => editHandler()}
                                        // disabled={ticketBought}
                                        className=" w-full h-[49px] text-white font-semibold rounded-lg disabled:bg-opacity-40 bg-chasescrollBlue text-sm " >
                                        Edit Event
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                    {/* <EventVenue location={location} /> */}
                </div>

                <div className=' w-full px-4 py-3 ' >
                    <p className=' font-bold text-[18px] text-black ' >About this event </p>
                    <p className=' text-[#5B5858] font-normal mt-2 ' >
                        {about}
                    </p>
                </div>
                <EventLocation location={location} locationType={locationType} />
                {location?.address && (
                    <div className=' w-full px-4 py-3 ' >
                        <p className=' font-bold text-[18px] text-black ' >Venue Details</p>
                        <p className=' text-[#5B5858] font-normal mt-2 ' >
                            {location?.address}
                        </p>
                    </div>

                )}
                {userId && (
                    <div className="flex items-center py-6 w-full justify-center">
                        <button
                            disabled={(isBought) ? false : selectedCategory?.ticketType ? false : true}
                            onClick={(isBought) ? viewTicket : buyTicket}
                            className={` bg-chasescrollBlue disabled:opacity-30 disabled:cursor-not-allowed text-white w-96 p-3 text-sm rounded-lg`}
                        >
                            {(isBought) ? "View" : isFree ? "Register" : "Get"} Ticket
                        </button>
                    </div>
                )}

                {!userId && (
                    <div className="flex items-center py-6 w-full justify-center">
                        <button
                            // disabled={(isBought) ? false : selectedCategory?.ticketType ? false : true}
                            onClick={() => setLoginModal(true)}
                            className={` bg-chasescrollBlue disabled:opacity-30 disabled:cursor-not-allowed text-white w-96 p-3 text-sm rounded-lg`}
                        >
                            {"Get"} Ticket
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EventDetail 
