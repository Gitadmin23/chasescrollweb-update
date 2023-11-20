import React from 'react'
import useInfinteScroller from '../../../../../hooks/useInfinteScroller'
import { formatTime, formatTimestampToDate } from '../../../../../utils/helpers'
import { Spinner } from "@chakra-ui/react";
import { useAuth } from '../../../../../context/authContext';
import { Link } from "react-router-dom"
import { PATH_NAMES } from '../../../../../constants/paths.constant';
import CONFIG from '../../../../../config';
import { BookmarkIcon, BookmarkIconFill, CalendarIcon, LocationIcon_2 } from "../../../../../components/Svgs"
import InfiniteScrollerComponent from '../../../../../hooks/infiniteScrollerComponent';
import LocationDetail from '../../../../../components/exploreComponents/loctionDetail';


function PastEventsTab() {

    const [page, setPage] = React.useState(0) 
  
    // const { results, isLoading, lastChildRef, refetch } = useInfinteScroller({url: "/events/get-past-events", pageNumber:page, setPageNumber:setPage})

    
    const { results, isLoading, ref, refetch, isRefetching } = InfiniteScrollerComponent({url:'/events/get-past-events', limit:10, filter: "id", newdata: false})

    const EventInfo = (event) => {
        return(
            <div 
                className="flex flex-col items-center justify-center mb-4 py-4 px-6 bg-white shadow rounded-b-[32px] rounded-tl-[32px] mx-auto max-w-3xl"
                key={event?.id}
                >
                <div className="flex flex-col md:flex-row gap-10 w-full items-center mb-2">
                <div className="w-44 h-40 object-cover rounded-b-[32px] rounded-tl-[32px]">
                    {event?.currentPicUrl ? (
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
                <div className="flex flex-col gap-2">
                    <h2 className="text-lg font-medium text-center md:text-left">
                    {event?.eventName}
                    </h2>
                    <div className="flex">
                    <span className="mr-1">
                        <CalendarIcon />
                    </span>
                    <p className="text-gray-600 text-sm">
                        {formatTimestampToDate(event?.startDate)}. {formatTime(event?.startTime)} - {formatTime(event?.endTime)}
                    </p>
                    </div>
                    <div className="flex items-center">
                    <span className="mr-1">
                        <LocationIcon_2 />
                    </span>

                    <LocationDetail location={event?.location} locationType={event?.locationType} length={20} style={"text-gray-600 text-sm capitaliz"} />
                    {/* <p className="text-gray-600 text-sm capitalize">
                        {event?.locationType}
                    </p> */}
                    </div>
                    <div className="flex items-center">
                    <div className="flex items-center mr-4">
                        <span className="mr-1">Category:</span>
                        <span className="text-blue-600">
                        {event?.eventType?.replace("_", " ")}
                        </span>
                    </div>
                    <button className="bg-blue-100 text-blue-600 text-sm px-2">
                        {event?.status}
                    </button>
                    </div>
                    {!event?.isOrganizer && (
                        <div className=" text-red-500 hover:text-red-600 font-bold py-2 px-4 rounded cursor-pointer">
                        View Ticket
                        </div>
                    )}
                </div>
                </div>
            </div>
        )
    }
    
    return (
        <>
            {!isLoading && (
                <div className="mb-[100px] mx-auto">
                    {results.map((event, i) => { 
                        if (results.length === i + 1) {
                            return(
                                <div ref={ref} >
                                    {EventInfo(event)}
                                </div>
                            )
                        } else {
                            return(  
                                <div >
                                    {EventInfo(event)}
                                </div> 
                            )
                        }
                    })}
                </div>
            )}

            {!isLoading && (
                <>
                    {results.length <= 0 && ( 
                        <div className="w-full h-32 flex justify-center items-center">
                            <p className=" font-semibold " >No Records Found</p>
                        </div>
                    )}
                </>
            )}
            
            {isLoading && (
                <div className="w-full h-32 flex justify-center items-center">
                    <Spinner size='md' color='brand.chasescrollButtonBlue' />
                </div>
            )}
        </>
    )
}

export default PastEventsTab
