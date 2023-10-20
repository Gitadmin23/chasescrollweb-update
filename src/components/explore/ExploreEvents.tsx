import React from 'react'; 
import { CalendarIcon, LocationIcon_2 } from "../Svgs"
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/authContext'
import { useMutation } from 'react-query'; 
import { toast } from "react-toastify";
import { Spinner } from "@chakra-ui/react";
import { AxiosError, AxiosResponse } from "axios";
// import { IEvent } from '../../models/Events'; 
import httpService from '../../utils/httpService'; 
import InfiniteScrollerComponent from '../../hooks/infiniteScrollerComponent';

const SearchEventCard = React.forwardRef(
  (event: any, ref: any) => {
  const navigate = useNavigate();
	const { userId } = useAuth() 
  // const queryClient = useQueryClient()
  const [isSaved, setIsSaved] = React.useState(event.isSaved)

  // save event
  const saveEvent = useMutation({
    mutationFn: (data: any) => httpService.post('/events/save-event', data),
    onError: (error: AxiosError<any, any>) => {
      toast.error(error.response?.data?.message);
    },
    onSuccess: (data: AxiosResponse<any>) => {
      toast.success(data.data?.message)
      // queryClient.invalidateQueries(['getEventSearch'])
      setIsSaved(true)
    }
  });

  const deletedSavedEvent = useMutation({
    
    mutationFn: (data: any) => httpService.post('/events/remove-saved-event', data),
    onError: (error: AxiosError<any, any>) => {
      toast.error(error.response?.data?.message);
    },
    onSuccess: (data: AxiosResponse<any>) => {
      toast.success(data.data?.message) 
      setIsSaved(false)
    }
  });

  const handleSave = React.useCallback(() => {
    if (isSaved) {
      deletedSavedEvent.mutate({
        eventID: event.id,
        typeID: userId,
        type: 'EVENT'
      })
    } else {
      saveEvent.mutate({
        eventID: event.id,
        typeID: userId,
        type: 'EVENT'
      })
    }
  }, [event, deletedSavedEvent, saveEvent])    
  
    return (
      <li ref={ref} key={event.id} className="border-b w-full p-2 px-4 ">
        <div className="flex my-4 items-center w-full justify-between">
          <div className="flex w-fit justify-start">
            <img onClick={() => navigate(`/events/${event.id}`)} src={"https://chaseenv.chasescroll.com/resource-api/download/"+event?.currentPicUrl} alt="profiles" className=" w-[150px] lg:w-[270px] lg:h-[150px] object-cover rounded-b-3xl rounded-tl-3xl cursor-pointer" />
          </div>

          <div className=' w-[60%]' >
            <div className="flex flex-col gap-4 flex-1 w-full justify-end pl-4">
              <h1 onClick={() => navigate(`/events/${event.id}`)}  className="border-b text-[18px] w-full flex items-center font-bold cursor-pointer">
                <span className=' ' >{event.eventName?.length >= 17 ? event.eventName.slice(0, 17)+"..." : event.eventName}{" "}</span>

                <span className=" ml-auto w-20 lg:mr-16 text-left md:pl-4">{event?.currency === "USD" ? "$" : "₦"}{event?.maxPrice}</span>
                {/* <span className="pl-1 md:pl-4">{event.maxPrice}</span> */}
              </h1>
              <span className="flex gap-2 text-xs md:text-sm text-[#2E2B2B] text-opacity-[67%]">
                <CalendarIcon /> 
                <span>{new Date(event.startDate).toDateString()}</span>
              </span>

              <div className="flex md:gap-8">
                <span className="flex gap-2 w-full text-xs md:text-sm text-[#1732F7] font-bold">
                  <LocationIcon_2 />{event?.location?.locationDetails ? (event?.location.locationDetails?.length >= 17 ? event?.location.locationDetails.slice(0, 17)+"..." : event?.location.locationDetails):
                      event?.location?.link ? (event?.location.link?.length >= 17 ? event?.location.link.slice(0, 17)+"..." : event?.location.link): ""}
                      
                </span>
                <div className="flex gap-2">
                
                  <span className="cursor-pointer" onClick={handleSave}>
                  { saveEvent.isLoading  && <Spinner size='md' color="brand.chasesccrollButtonBlue" /> }
                  { !saveEvent.isLoading && (
                      <span className='text-2xl'>
                      {isSaved && 
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M12.6133 1.5H5.38328C3.78578 1.5 2.48828 2.805 2.48828 4.395V14.9625C2.48828 16.3125 3.45578 16.8825 4.64078 16.23L8.30078 14.1975C8.69078 13.98 9.32078 13.98 9.70328 14.1975L13.3633 16.23C14.5483 16.89 15.5158 16.32 15.5158 14.9625V4.395C15.5083 2.805 14.2108 1.5 12.6133 1.5Z"  fill='black' stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M12.6133 1.5H5.38328C3.78578 1.5 2.48828 2.805 2.48828 4.395V14.9625C2.48828 16.3125 3.45578 16.8825 4.64078 16.23L8.30078 14.1975C8.69078 13.98 9.32078 13.98 9.70328 14.1975L13.3633 16.23C14.5483 16.89 15.5158 16.32 15.5158 14.9625V4.395C15.5083 2.805 14.2108 1.5 12.6133 1.5Z" fill='black' stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>}
                      {!isSaved && 
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M12.6133 1.5H5.38328C3.78578 1.5 2.48828 2.805 2.48828 4.395V14.9625C2.48828 16.3125 3.45578 16.8825 4.64078 16.23L8.30078 14.1975C8.69078 13.98 9.32078 13.98 9.70328 14.1975L13.3633 16.23C14.5483 16.89 15.5158 16.32 15.5158 14.9625V4.395C15.5083 2.805 14.2108 1.5 12.6133 1.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12.6133 1.5H5.38328C3.78578 1.5 2.48828 2.805 2.48828 4.395V14.9625C2.48828 16.3125 3.45578 16.8825 4.64078 16.23L8.30078 14.1975C8.69078 13.98 9.32078 13.98 9.70328 14.1975L13.3633 16.23C14.5483 16.89 15.5158 16.32 15.5158 14.9625V4.395C15.5083 2.805 14.2108 1.5 12.6133 1.5Z" stroke="black" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg> 
                      }
                    </span>
                  )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )   
  }
)

const ExploreEvents = () => { 

  const { searchValue } = useAuth()    

  const { results, isLoading, ref, isRefetching } = InfiniteScrollerComponent({url:`/events/events?eventName=${searchValue}`, limit:10, filter: "userId"})
  

  return (
    <div className="px-4 h-auto overflow-auto pb-96">
     {/* {!isLoading && ( */}
       <ul className="w-full mx-auto flex flex-col border rounded-3xl">
       {results?.map((post: any, i: number) => {
        if (results.length === i + 1) {
          return (
              <SearchEventCard {...post} ref={ref} />
            )
        } else {
          return (
            <SearchEventCard {...post} />
          )
        }
       })}
     </ul>
    {/* //  )} */}
     {(isLoading && isRefetching) && (
       <div className="w-full h-32 flex justify-center items-center">
         <Spinner size='md' color='brand.chasescrollButtonBlue' />
       </div>
     )}
     {(!isLoading && results.length <= 0) && (
      <div className=' w-full py-5 flex justify-center font-bold text-2xl ' >
        No Records Found
      </div>
     )}
    </div>
  )
}

export default ExploreEvents
