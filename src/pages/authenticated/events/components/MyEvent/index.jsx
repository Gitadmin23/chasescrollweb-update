import React from 'react'
import useInfinteScroller from '../../../../../hooks/useInfinteScroller'
import { formatTime, formatTimestampToDate } from '../../../../../utils/helpers'
import { Spinner } from "@chakra-ui/react";
import { useAuth } from '../../../../../context/authContext';
import { Link, useNavigate } from "react-router-dom"
import { PATH_NAMES } from '../../../../../constants/paths.constant';
import CONFIG from '../../../../../config';
import { BookmarkIcon, BookmarkIconFill, CalendarIcon, LocationIcon_2 } from "../../../../../components/Svgs"
import { useFetch } from '../../../../../hooks/useFetch';
import { toast } from "react-toastify"
import { useMutation, useQueryClient } from 'react-query';
import { IoMdTrash } from 'react-icons/io';
import InfiniteScrollerComponent from '../../../../../hooks/infiniteScrollerComponent';
import LocationDetail from '../../../../../components/exploreComponents/loctionDetail';

function MyEventTab() {

    const { userName, token, userId, setEventCategory } = useAuth()

    const [page, setPage] = React.useState(0)
    const [deletedEvent, setDeletedEvent] = React.useState([])


    const navigate = useNavigate()

    const { results, isLoading, ref, refetch, isRefetching } = InfiniteScrollerComponent({ url: '/events/joined-events/' + userId, limit: 10, filter: "id", newdata: false })

    // const { userId, token, eventCategory } = useAuth()
    const { sendRequest } = useFetch()

    const queryClient = useQueryClient()


    const addfriend = useMutation({
        mutationFn: (data) => httpService.delete("/events/delete-event/" + eventID, data),
        onError: (error) => {
            toast.error(error.response?.data?.message);
        },
        onSuccess: (data) => {
            toast.success(data.data?.message)
        }
    });

    const deleteEvent = async (eventID) => {
        // setLoading(userId)
        const data = await sendRequest(
            "/events/delete-event/" + eventID,
            "DELETE",
            null,
            { Authorization: `Bearer ${token}` }
        )
        if (data) {
            toast.success(data.message);
            setDeletedEvent([...deletedEvent, eventID])
            refetch()
        }
    }

    const EventInfo = (event) => {
        return (
            <div
                // to={`${PATH_NAMES.event}/${event.id}`}
                className="flex flex-col items-center justify-center mb-4 py-4 px-6 bg-white shadow rounded-b-[32px] rounded-tl-[32px] w-full mx-auto max-w-3xl "
                key={event?.id}
            >
                <div className="flex flex-col md:flex-row gap-6 w-full items-center mb-2">
                    <div className=' w-full lg:w-fit ' > 
                        <div role='button' onClick={() => navigate(`${PATH_NAMES.event}/${event.id}`)} className="lg:w-44 w-full h-52 lg:h-40 object-cover rounded-b-[32px] rounded-tl-[32px]">
                            {event?.currentPicUrl ? (
                                <img
                                    src={`${CONFIG.RESOURCE_URL}${event?.currentPicUrl}`}
                                    alt="descriptive photograph"
                                    className=" w-full h-full rounded-b-[32px] rounded-tl-[32px] object-cover "
                                />
                            ) : (
                                <div className=" w-full h-full rounded-b-[32px] flex justify-center items-center rounded-tl-[32px] bg-slate-400" >
                                    <p className=" text-2xl capitalize " >{event?.eventName?.slice(0, 2)}</p>
                                </div>
                            )
                            }
                        </div>
                    </div>
                    <div className="flex flex-col w-full gap-2">
                        <h2 role='button' onClick={() => navigate(`${PATH_NAMES.event}/${event.id}`)} className="text-lg font-medium leading-tight text-center md:text-left">
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

                            <LocationDetail location={event?.location} locationType={event?.locationType} length={20} style={"text-gray-600 text-sm"} />
                            {/* <p className="text-gray-600 text-sm">
                        {event?.location?.address}
                    </p>  */}
                        </div>
                        <div className="flex items-center">
                            <button className="bg-blue-100 text-blue-600 text-sm px-2">
                                {event?.status}
                            </button>
                            {!event?.ticketBought && (
                                <button onClick={() => deleteEvent(event?.id)} className=' ml-auto text-red-600 ' >delete</button>
                            )}
                        </div>
                        <div className="text-gray-600 text-sm flex items-center w-full gap-2">
                            Category: <span className=" text-blue-500 hover:text-blue-600 font-bold cursor-pointer">
                                {event?.eventType?.replace("_", " ")}
                            </span>
                            <span className="bg-chasescrollBgBlue text-chasescrollBlue ml-auto px-2 py-1 rounded-md">
                                {event?.isOrganizer ? "Organizer" : "Attending"}
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {!isLoading && (
                <div className="mb-[100px] mx-auto">
                    {results?.filter((item) => !deletedEvent.includes(item.id)).map((event, i) => {
                        if (results.length === i + 1) {
                            return (
                                <div  ref={ref} >
                                    {EventInfo(event)}
                                </div>
                            )
                        } else {
                            return (
                                <div >
                                    {EventInfo(event)}
                                </div>
                            )
                        }
                    })}
                </div>
            )}
            {(!isLoading || !isRefetching) && (
                <>
                    {results.length < 1 && (
                        <div className="w-full h-32 flex justify-center items-center">
                            <p className=" font-semibold " >No Records Found</p>
                        </div>
                    )}
                </>
            )}

            {(isLoading || isRefetching) && (
                <div className="w-full h-32 flex justify-center items-center">
                    <Spinner size='md' color='brand.chasescrollButtonBlue' />
                </div>
            )}
        </>
    )
}

export default MyEventTab
