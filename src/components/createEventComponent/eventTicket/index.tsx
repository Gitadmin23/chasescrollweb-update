import { useState } from 'react'
import { toast } from 'react-toastify';
import OverlayWrapper from '../../../components/OverlayWrapper';
import CommunityFunnel from '../../../components/events/CommunityFunnel';
import CreateCommunity from '../../../pages/authenticated/communities/CreateCommunity';
import { Checkbox, Input, Select } from '@chakra-ui/react';
import { OpenFolderIcon, QuestionIcon } from '../../../components/Svgs';
import { CLOSE_ENTITY } from '../../../constants';
import CONFIG from '../../../config';

interface Props { 
    formData: any, 
    setFormData: any, 
    handleChange: any, 
    handleSubmit: any, 
    loading: any, 
    handleChangeOther: any, 
    HandlerDeleteTicket: any, 
    HandleDeleteAllTicket: any, 
    HandleAddTicket: any 
}

function CreateEventTicket(props: Props) {
    const { formData, setFormData, handleChange, handleSubmit, loading, handleChangeOther, HandlerDeleteTicket, HandleDeleteAllTicket, HandleAddTicket } = props

    const [showTooltip, setShowTooltip] = useState(false);
    const [isFree, setIsFree] = useState(false)
    const [showFunnel, setShowFunnel] = useState(false) 
    const [addFunnel, setAddFunnel] = useState(false) 
    const [funnel, setFunnel] = useState("" as any)
  
    // const [categories, setCategories] = useState([])
  
    const toggleTooltip = () => setShowTooltip((state: any) => !state);
    const toggleFunnel = () => setShowFunnel((state: any) => !state);
    const toggleStatus = () => {
        setIsFree(state => !state)
        if (isFree) {
            setFormData((data: any) => ({
            ...data, 
            }))
        }
    }
  
    
  
    // const handleExpirationDateSelect = (date, dateString) => {
    //     setFormData((data: any) => ({
    //         ...data,
    //         expirationDate: Date.parse(new Date(date?.$d).toJSON()),
    //     }))
    // }
  
    // const [ticketArray, setArray] = React.useState([""]) 
  
    const clickHandler =()=> {
        if(!formData?.productTypeData[0].totalNumberOfTickets){
            toast.error("Enter Event Total Ticket Number")
        } else if(!formData?.productTypeData[0].ticketType){
            toast.error("Enter Event Ticket Type") 
        } else if(!formData?.productTypeData[0].minTicketBuy){
            toast.error("Enter Event Minimum Ticket Purchase")
        } else if(!formData?.productTypeData[0].maxTicketBuy){
            toast.error("Enter Event Maximum Ticket Purchase")
        } else {
            if(formData?.productTypeData[0].ticketType !== "Free"){
            if(formData.currency === "NGN"){
                formData.productTypeData?.map((item)=> {
                if(item.ticketPrice < 1000) {
                    toast.error("Ticket Price must be Above 1000 naira")
                } else {  
                    handleSubmit()
                }
                })
            } else { 
                formData.productTypeData?.map((item)=> {
                if(item.ticketPrice < 10) {
                    toast.error("Ticket Price must be Above 10 dollar")
                } else { 
                    handleSubmit() 
                }
                })
            }
            } else { 
            handleSubmit()
            }
        } 
    } 
  
    return (
        <div className=' w-full flex flex-col items-center pt-10 px-6 ' > 
            <div className=' lg:max-w-[600px] w-full flex  flex-col gap-4 py-6 ' >
                <div className=' w-full flex lg:flex-row gap-2 ' >  
                    <label
                        onClick={()=> HandleDeleteAllTicket("", null)}
                        className={`text-[#667085] border rounded-lg hover:text-chasescrollBlue hover:bg-chasescrollBlue hover:bg-opacity-[5%] cursor-pointer w-full p-2 flex justify-center items-center gap-2 ${!isFree
                            ? "bg-chasescrollBlue bg-opacity-[5%] text-chasescrollBlue"
                            : "" }`
                        }
                        htmlFor="isPaid"  >
                        <Checkbox 
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 text-sm md:text-base"
                            isChecked={!isFree}
                            id="isPaid"
                            onChange={toggleStatus}  />
                        Paid
                    </label>
                    <label
                        onClick={()=> HandleDeleteAllTicket("Free", 0)}
                        className={`text-[#667085] border rounded-lg hover:text-chasescrollBlue hover:bg-chasescrollBlue hover:bg-opacity-[5%] cursor-pointer w-full p-2 flex justify-center items-center gap-2 ${isFree
                            ? "bg-chasescrollBlue bg-opacity-[5%] text-chasescrollBlue"
                            : "" }`
                        }
                        htmlFor="isFree" >
                            <Checkbox 
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-blue-600 text-sm md:text-base"
                                isChecked={isFree}
                                id="isFree"
                                onChange={toggleStatus} />
                            Free
                    </label>
                </div>

                {formData.productTypeData?.map((item: any, index: number)=> {
                    return(
                        <div className=" w-full flex flex-col gap-4 " key={index+item} > 
                            <div className=" w-full flex lg:flex-row flex-col gap-3 " >
                                <div className=" w-full">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Enter TicketName
                                    </label>
                                    <div className="flex ">
                                        <Input
                                        h={"45px"}
                                            type="text"
                                            className="block text-xs md:text-sm w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gr00 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                            placeholder="Enter Name"
                                            disabled={formData.productTypeData[index]?.ticketType === "Free" ? true : false}
                                            value={formData.productTypeData[index]?.ticketType}
                                            name="ticketType"
                                            onChange={e => handleChange(index, "ticketType", e.target.value)}
                                        /> 
                                    </div>
                                </div>
                                <div className=" w-full">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Enter Price
                                    </label>
                                    <div className="flex gap-2">
                                        <Input
                                        h={"45px"}
                                            type="number"
                                            className="block text-xs md:text-sm w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                            placeholder="Enter amount"
                                            value={formData.productTypeData[index]?.ticketPrice}
                                            disabled={formData.productTypeData[index]?.ticketType === "Free" ? true : false}
                                            name="ticketPrice"
                                            onChange={e => handleChange(index, "ticketPrice", e.target.value)}
                                        /> 
                                    </div>
                                </div> 
                            </div> 
                            <div className="w-full">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Indicate total number of tickets available to be sold for your
                                    events
                                </label>
                                <Input
                                        h={"45px"}
                                    type="number"
                                    className="block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder=" Type in available quantity"
                                    // value={formData.totalTicketAvailable}
                                    value={formData.productTypeData[index]?.totalNumberOfTickets}
                                    name="totalNumberOfTickets"
                                    onChange={e =>
                                        handleChange(index, "totalNumberOfTickets", e.target.value)
                                    }
                                />
                            </div> 
                            <div className="w-full">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Indicate the minimum and maximum number of tickets each user can
                                    purchase for your event
                                </label>
                                <Input
                                        h={"45px"}
                                    type="number"
                                    className="block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Type in minimum no of Tickets"
                                    value={formData.productTypeData[index]?.minTicketBuy}
                                    name="minTicketBuy"
                                    onChange={e => handleChange(index, "minTicketBuy", e.target.value)} />
                                <Input
                                        h={"45px"}
                                    type="number"
                                    className="block mt-4 w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    placeholder="Type in maximum no. of Tickets"
                                    value={formData.productTypeData[index]?.maxTicketBuy}
                                    name="maxTicketBuy"
                                    onChange={e => handleChange(index, "maxTicketBuy", e.target.value)} />
                            </div>
                            {formData.productTypeData[index]?.ticketType && (
                                <> 
                                    {index !== 0 && ( 
                                        <button onClick={()=> HandlerDeleteTicket(formData.productTypeData[index]?.ticketType)} className=" mt-3 font-bold border text-white bg-red-600 rounded-md mr-auto py-2 w-fit px-3 " >Remove</button>
                                    )}
                                </>
                            )} 
                            
                        </div>
                    )
                })}

                {formData.productTypeData[0]?.ticketType !== "Free" && (
                    <button onClick={()=> HandleAddTicket(formData?.productTypeData?.length)} className=" mt-3 font-bold border text-white bg-blue-600 rounded-md py-2 w-fit px-3 " >+ Add New Ticket Type</button>
                )} 
                <Select
                    h={"45px"}
                    className="block my-4 w-full px-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    placeholder="Type in maximum no. of Tickets"
                    value={formData.currency}
                    name="currency"
                    onChange={handleChangeOther}
                >
                    <option>NGN</option>
                    <option>USD</option>
                </Select>  

                <div className="flex w-full mt-2 justify-between">
                    <div className="flex cursor-pointer" onClick={toggleFunnel}>
                        <OpenFolderIcon />
                        <span className="text-chasescrollBlue underline hover:text-chasescrollDarkBlue ml-2">
                        Select community funnel
                        </span>
                    </div>
                    <div className="cursor-pointer " onClick={toggleTooltip}>
                        <QuestionIcon />
                    </div>
                </div>
                {funnel && (
                    <div className="flex justify-between p-2 rounded-lg shadow-lg w-full self-start my-4">
                        <div className="flex gap-2">
                            <img
                            alt="community funnel banner"
                            src={funnel?.data?.imgSrc === "string" || !funnel?.data?.imgSrc ? `https://ui-avatars.com/api/?background=random&name=${funnel?.data?.name}&length=1` : `${CONFIG.RESOURCE_URL}${funnel?.data?.imgSrc}`}
                            className="object-cover rounded-b-full rounded-tl-full w-8 h-8"
                            />
                            <div className="flex flex-col">
                            <p className="text-base">{funnel?.data?.name}</p>
                            <p className="text-xs">{funnel?.data?.description}</p>
                            </div>
                        </div>
                        <span
                            className="cursor-pointer"
                            onClick={() => setFunnel(null)}
                        >
                            {CLOSE_ENTITY}
                        </span>
                    </div>
                )}

                <div className="flex justify-center my-4 w-full">
                    {/* <button onClick={handleBack}>Back</button> */}
                    <button
                        className="w-full py-3 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        onClick={clickHandler}
                        disabled={loading}
                    >
                        {loading? "loading" : "Submit"}
                    </button>
                </div>
            </div> 

            {showTooltip && (
                <OverlayWrapper handleClose={toggleTooltip}>
                    <div className="flex w-fit h-fit p-4">
                        <div className="bg-white border shadow-lg rounded-[32px] p-8 w-full max-w-xl flex flex-col gap-4 justify-center">
                            <h1 className="text-xl font-bold">
                                Why & how to add community funnel?
                            </h1>
                            <p className="leading-5">
                                Link your event to a new or existing community so that all
                                your attendees will be added automatically into a community.
                                Here, they can ask questions, you can share future events and
                                also network with other event attendees. You can organically
                                grow any community of your choice, share pictures, videos,
                                engage attendees in one on one chat or group chat.
                            </p>
                            <button
                                onClick={toggleTooltip}
                                className="text-lg font-bold text-chasescrollBlue"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </OverlayWrapper>
            )}
            {showFunnel && (
                <CommunityFunnel
                    toggleFunnel={toggleFunnel}
                    funnel={funnel}
                    setFunnel={setFunnel}
                    setFormData={setFormData}
                    addFunnel={addFunnel} 
                    setaddfunnel={setAddFunnel}
                    formData={formData}
                />
            )}
            {addFunnel && (
                <div className="flex flex-col gap-8 fixed overflow-auto bg-white inset-0 z-20 px-4 py-10">
                    <CreateCommunity 
                        modal={true}
                        setFunnel={toggleFunnel}
                        setaddfunnel={setAddFunnel}
                    />
                </div>
            )}
        </div>
    )
}

export default CreateEventTicket
