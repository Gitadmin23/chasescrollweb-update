import React, { useState, useEffect } from "react"
// import DatePicker from "react-datepicker"
// import TimePicker from "react-time-picker"
import GroupAvatar from "@/assets/svg/group-avatar.svg"
import { toast } from "react-toastify"


import {
  ClockIcon,
  CalenderIcon,
  OpenFolderIcon,
  QuestionIcon,
} from "@/components/Svgs"
import OverlayWrapper from "../OverlayWrapper"
import { CalendarIcon, CloseIcon } from "../Svgs"
import { DatePicker } from "antd"
import { convertToISO } from "../../utils/helpers"
import CommunityFunnel from "./CommunityFunnel"
import CONFIG from "../../config"
import { CLOSE_ENTITY } from "../../constants"
import CreateCommunity from "../../pages/authenticated/communities/CreateCommunity"

const EventTicket = ({ formData, setFormData, handleChange, handleSubmit, loading, handleChangeOther, HandlerDeleteTicket, HandleDeleteAllTicket, HandleAddTicket }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isFree, setIsFree] = useState(false)
  const [showFunnel, setShowFunnel] = useState(false) 
  const [addFunnel, setAddFunnel] = useState(false) 
  const [funnel, setFunnel] = useState(null)

  // const [categories, setCategories] = useState([])

  const toggleTooltip = () => setShowTooltip(state => !state);
  const toggleFunnel = () => setShowFunnel(state => !state);
  const toggleStatus = () => {
    setIsFree(state => !state)
    if (isFree) {
      setFormData(data => ({
        ...data,

      }))
    }
  }

  

  const handleExpirationDateSelect = (date, dateString) => {
    setFormData(data => ({
      ...data,
      expirationDate: Date.parse(new Date(date?.$d).toJSON()),
    }))
  }

  const [ticketArray, setArray] = React.useState([""]) 

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
    <div className="py-6 flex flex-col justify-center items-center relative mx-auto w-full px-6 max-w-2xl">
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

      <div className="flex flex-col justify-center ">
        <div className="flex gap-2">
          <label
            onClick={()=> HandleDeleteAllTicket("", null)}
            className={`text-[#667085] border rounded-lg hover:text-chasescrollBlue hover:bg-chasescrollBlue hover:bg-opacity-[5%] cursor-pointer basis-1/3 p-2 flex justify-center items-center gap-2 ${!isFree
              ? "bg-chasescrollBlue bg-opacity-[5%] text-chasescrollBlue"
              : ""
              }`}
            htmlFor="isPaid"
          >
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 text-sm md:text-base"
              checked={!isFree}
              id="isPaid"
              onChange={toggleStatus}
            />
            Paid
          </label>
          <label
            onClick={()=> HandleDeleteAllTicket("Free", 0)}
            className={`text-[#667085] border rounded-lg hover:text-chasescrollBlue hover:bg-chasescrollBlue hover:bg-opacity-[5%] cursor-pointer basis-1/3 p-2 flex justify-center items-center gap-2 ${isFree
              ? "bg-chasescrollBlue bg-opacity-[5%] text-chasescrollBlue"
              : ""
              }`}
            htmlFor="isFree"
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600 text-sm md:text-base"
              checked={isFree}
              id="isFree"
              onChange={toggleStatus}
            />
            Free
          </label>
        </div> 
        {formData.productTypeData?.map((item, index)=> {
          return(
            <div className=" w-full " key={index} > 
              <div className=" w-full flex gap-3 " >
                <div className="my-4 w-full">
                  <label className="block text-gray-700 font-medium mb-2">
                    Enter TicketName
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="block text-xs md:text-sm w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      placeholder="Enter Name"
                      disabled={formData.productTypeData[index]?.ticketType === "Free" ? true : false}
                      value={formData.productTypeData[index]?.ticketType}
                      name="ticketType"
                      onChange={e => handleChange(index, "ticketType", e.target.value)}
                    /> 
                  </div>
                </div>
                <div className="my-4 w-full">
                  <label className="block text-gray-700 font-medium mb-2">
                    Enter Price
                  </label>
                  <div className="flex gap-2">
                    <input
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

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Indicate total number of tickets available to be sold for your
                  events
                </label>
                <input
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

              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Indicate the minimum and maximum number of tickets each user can
                  purchase for your event
                </label>
                <input
                  type="number"
                  className="block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Type in minimum no of Tickets"
                  value={formData.productTypeData[index]?.minTicketBuy}
                  name="minTicketBuy"
                  onChange={e => handleChange(index, "minTicketBuy", e.target.value)}
                />
                <input
                  type="number"
                  className="block mt-4 w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Type in maximum no. of Tickets"
                  value={formData.productTypeData[index]?.maxTicketBuy}
                  name="maxTicketBuy"
                  onChange={e => handleChange(index, "maxTicketBuy", e.target.value)}
                />
              </div>
              {formData.productTypeData[index]?.ticketType && (
                <> 
                  {index !== 0 && ( 
                    <button onClick={()=> HandlerDeleteTicket(formData.productTypeData[index]?.ticketType)} className=" mt-3 font-bold border text-white bg-red-600 rounded-md  py-2 w-fit px-3 " >Remove</button>
                  )}
                </>
              )}
            </div>
          )
        })}

        {formData.productTypeData[0]?.ticketType !== "Free" && (
          <button onClick={()=> HandleAddTicket(formData?.productTypeData?.length)} className=" mt-3 font-bold border text-white bg-blue-600 rounded-md  py-2 w-fit px-3 " >+ Add New Ticket Type</button>
        )}

        <select
            type="text"
            className="block my-4 w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            placeholder="Type in maximum no. of Tickets"
            value={formData.currency}
            name="currency"
            onChange={handleChangeOther}
          >
            <option>NGN</option>
            <option>USD</option>
          </select>      
          
          {/* <div className="flex flex-col gap-4 mt-4 mb-4">
          <h1>Ticket Expiration Date</h1>
          <div className="flex border w-fit">
            <div className="justify-center items-center flex px-4">
              <CalendarIcon />
            </div>
            <div className="flex flex-col gap-2 p-2">
              {" "}
              <p className="text-xs text-[#D0D4EB]">
                {" "}
                End <span className="text-[#F04F4F]">*</span>
              </p>
              <DatePicker
                showTime
                format="YYYY-MM-DD h:mm a"
                onChange={handleExpirationDateSelect}
                className="text-xs md:text-sm px-2 w-40"
                placeholder="End date and time"
              />
            </div>
          </div>
        </div> */}

        <div className="flex mt-2 justify-between">
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



        {/* TODO: add funnel */}
        {/* <div className="mt-4 flex rounded-xl shadow-lg pl-4 py-4">
            <img src={GroupAvatar} alt="Group Avatar" />
            <div className="ml-2">
              <h1 className="font-bold">BTC Blockchain Community</h1>
              <span className="text-[#2E2B2B] opacity-60">2k+ Members</span>
            </div>
          </div> */}
      </div>
      {funnel && (
        <div className="flex justify-between p-2 rounded-lg shadow-lg w-full max-w-md self-start my-4">
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
  )
}

export default EventTicket