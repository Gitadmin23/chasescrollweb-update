import React, { useState, forwardRef } from 'react'
import CONFIG from '../../config'
import { SAVE_EVENT } from '../../constants/endpoints.constant'
import { useAuth } from '../../context/authContext'
import { useFetch } from '../../hooks/useFetch'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import LocationDetail from '../exploreComponents/loctionDetail'



const EventTiles = React.forwardRef((props, ref) =>{

    const {
        event,
        getdata
    } = props 

    const [allEvents, setAllEvents] = useState([])
    const [loading, setLoading] = useState(false)
    const { userId, token, eventCategory } = useAuth()
    const { sendRequest } = useFetch()
    const navigate = useNavigate()

    const saveEvent = eventID => {
        sendRequest(
            SAVE_EVENT, "POST", {
            eventID: eventID ,
            typeID: userId,
            type: "EVENT"
            }, {
            Authorization: `Bearer ${token}`,
        }).then(response => {
        if (response?.updated) {
            toast.success(response?.message)
        } else {
            toast.error(response?.message)
        }
        })
        getdata()
    }

    const unsaveEvent = eventID => {
        sendRequest(
        "/events/remove-saved-event", "POST", {
        eventID: eventID ,
        typeID: userId,
        type: "EVENT"
        }, {
        Authorization: `Bearer ${token}`,
        }).then(response => {
        if (response?.updated) {
            toast.success(response?.message)
        } else {
            toast.error(response?.message)
        }
        })
        getdata()
    }

    const handleEvent= item => {
        if(item?.isSaved){
        unsaveEvent(item?.id)
        } else {
        saveEvent(item?.id)
        }
    }


    return ( 
      <div ref={ref} className=" max-w-3xl border rounded-b-[36px] gap-4 rounded-tl-[36px] flex lg:flex-row flex-col items-center py-[11px] px-[15px] " >
        <div className=" w-full lg:w-fit " > 
          <div className="rounded-b-[32px] rounded-tl-[32px]  w-full lg:w-[152px] h-[250px] lg:h-[152px] overflow-hidden">
            {event?.picUrls?.length > 0 ? (
              <img
                src={`${CONFIG.RESOURCE_URL}${event?.currentPicUrl}`}
                alt="descriptive photograph"
                className=" w-full h-full rounded-b-[32px] rounded-tl-[32px] object-cover "
              />
            ): (
              <div className=" w-full h-full rounded-b-[32px] flex justify-center items-center rounded-tl-[32px] bg-slate-400" >
                <p className=" text-2xl capitalize " >{event?.eventName?.slice(0,2)}</p>
              </div>
            )
            }
          </div> 
        </div>
        <div className="  w-full h-full flex flex-col pb-4 " >
          <div 
              role='button'
              onClick={() => navigate(`/events/${event.id}`)}  className=" w-full flex items-center justify-between gap-2 py-2 border-b " > 
            <p className=" font-bold text-lg " >{event.eventName?.length >= 17 ? event.eventName.slice(0, 17)+"..." : event.eventName}</p>
            <p className=" text-sm font-medium " >{event?.currency === "USD" ? "$" : "₦"}{event?.maxPrice}</p>
          </div>
          <div className="flex w-full gap-2 mt-6 lg:mt-auto" >
            <svg className=" mt-[2px] " width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="vuesax/linear/calendar">
              <g id="vuesax/linear/calendar_2">
              <g id="calendar">
              <path id="Vector" d="M6 1.5V3.75" stroke="#747070" stroke-width="0.9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_2" d="M12 1.5V3.75" stroke="#747070" stroke-width="0.9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_3" d="M2.625 6.81641H15.375" stroke="#747070" stroke-width="0.9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_4" d="M15.75 6.375V12.75C15.75 15 14.625 16.5 12 16.5H6C3.375 16.5 2.25 15 2.25 12.75V6.375C2.25 4.125 3.375 2.625 6 2.625H12C14.625 2.625 15.75 4.125 15.75 6.375Z" stroke="#747070" stroke-width="0.9" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_5" d="M11.7713 10.2734H11.778" stroke="#747070" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_6" d="M11.7713 12.5234H11.778" stroke="#747070" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_7" d="M8.99588 10.2734H9.00262" stroke="#747070" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_8" d="M8.99588 12.5234H9.00262" stroke="#747070" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_9" d="M6.22049 10.2734H6.22723" stroke="#747070" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
              <path id="Vector_10" d="M6.22049 12.5234H6.22723" stroke="#747070" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              </g>
              </g>
            </svg>  
            <p className="text-[#747070] font-medium " >{new Date(event.startDate).toDateString()}</p>
          </div>
          <div className="flex w-full items-center justify-between gap-2 mt-1" >
            <svg className=" mt-[2px] " width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Hicon / Bold / Location">
              <g id="Location">
              <path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M11.0856 14.7754C12.8179 12.5663 15 9.35694 15 7.20652C15 3.64068 12.3137 0.75 9 0.75C5.68629 0.75 3 3.64068 3 7.20652C3 9.35694 5.18209 12.5663 6.91441 14.7754C7.81818 15.9279 8.27007 16.5041 9 16.5041C9.72993 16.5041 10.1818 15.9279 11.0856 14.7754ZM9 9.75C7.75736 9.75 6.75 8.74264 6.75 7.5C6.75 6.25736 7.75736 5.25 9 5.25C10.2426 5.25 11.25 6.25736 11.25 7.5C11.25 8.74264 10.2426 9.75 9 9.75Z" fill="#1732F7"/>
              </g>
              </g>
            </svg>
            <LocationDetail location={event?.location} locationType={event?.locationType} length={20} style={"font-medium text-[#1732F7]"} />
                    
            {/* <p className=" font-medium text-[#1732F7] " >
              
            {event?.location?.locationDetails ? (event?.location.locationDetails?.length >= 17 ? event?.location.locationDetails.slice(0, 17)+"..." : event?.location.locationDetails):
                      event?.location?.link ? (event?.location.address?.length >= 17 ? event?.location.address.slice(0, 17)+"..." : event?.location.address): ""}
              </p> */}
            <button onClick={() => handleEvent(event)} className=" w-8 ml-auto " > 
              {event.isSaved && 
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="vuesax/linear/frame">
                  <g id="vuesax/linear/frame_2">
                  <g id="frame">
                  <path id="Vector" d="M12.6152 1.5H5.38523C3.78773 1.5 2.49023 2.805 2.49023 4.395V14.9625C2.49023 16.3125 3.45773 16.8825 4.64273 16.23L8.30273 14.1975C8.69273 13.98 9.32273 13.98 9.70523 14.1975L13.3652 16.23C14.5502 16.89 15.5177 16.32 15.5177 14.9625V4.395C15.5102 2.805 14.2127 1.5 12.6152 1.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="Vector_2" d="M12.6152 1.5H5.38523C3.78773 1.5 2.49023 2.805 2.49023 4.395V14.9625C2.49023 16.3125 3.45773 16.8825 4.64273 16.23L8.30273 14.1975C8.69273 13.98 9.32273 13.98 9.70523 14.1975L13.3652 16.23C14.5502 16.89 15.5177 16.32 15.5177 14.9625V4.395C15.5102 2.805 14.2127 1.5 12.6152 1.5Z" fill="black" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  </g>
                  </g>
                </svg>
              }
              {!event.isSaved && 
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="vuesax/linear/frame">
                  <g id="vuesax/linear/frame_2">
                  <g id="frame">
                  <path id="Vector" d="M12.6152 1.5H5.38523C3.78773 1.5 2.49023 2.805 2.49023 4.395V14.9625C2.49023 16.3125 3.45773 16.8825 4.64273 16.23L8.30273 14.1975C8.69273 13.98 9.32273 13.98 9.70523 14.1975L13.3652 16.23C14.5502 16.89 15.5177 16.32 15.5177 14.9625V4.395C15.5102 2.805 14.2127 1.5 12.6152 1.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path id="Vector_2" d="M12.6152 1.5H5.38523C3.78773 1.5 2.49023 2.805 2.49023 4.395V14.9625C2.49023 16.3125 3.45773 16.8825 4.64273 16.23L8.30273 14.1975C8.69273 13.98 9.32273 13.98 9.70523 14.1975L13.3652 16.23C14.5502 16.89 15.5177 16.32 15.5177 14.9625V4.395C15.5102 2.805 14.2127 1.5 12.6152 1.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  </g>
                  </g>
                </svg>
              }
            </button>
          </div>
        </div>
      </div>
    )
})

export default EventTiles
