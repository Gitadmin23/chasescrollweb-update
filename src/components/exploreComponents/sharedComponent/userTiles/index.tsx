import React, { forwardRef, useState } from "react" 
import { Popover, Transition } from "@headlessui/react"
// import img from "@/assets/images/suggestprofile.png"
import { HollowEllipsisIcon } from "../../../../components/Svgs"
import { SUGGESTION_MENU } from "../../../../constants"
import { isEven } from "../../../../utils/helpers" 
import { BLOCK_USER } from "../../../../constants/endpoints.constant" 
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"; 
import { AxiosError, AxiosResponse } from "axios"
import { useMutation } from "react-query"
import httpService from "../../../../utils/httpService"

interface Props {
    mutuals: number,
    data:any,
    firstName: any,
    lastName: any,
    publicProfile: boolean,
    userId: any,
    img: any,
    check: any
}

const UserTile = forwardRef<any, Props>
    (({
    mutuals = 0,
    data,
    firstName,
    lastName, 
    userId, 
    }, ref: any) => { 
         
        const [Loading, setLoading] = useState("0")
        const [isFriend, setisFriend] = useState(data?.joinStatus)
        const navigate = useNavigate(); 

        const unfriend = useMutation({
            mutationFn: () => httpService.delete("/user/remove-friend/"+userId, {}),
            onError: (error: AxiosError<any, any>) => {
            toast.error(error.response?.data?.message);
            },
            onSuccess: (data: AxiosResponse<any>) => {
            toast.success(data.data?.message) 
            setLoading("0")
            setisFriend("pending") 
            }
        });

        const addfriend = useMutation({
            mutationFn: (data: any) => httpService.post("/user/send-friend-request", data),
                onError: (error: AxiosError<any, any>) => {
                toast.error(error.response?.data?.message);
            },
            onSuccess: (data: AxiosResponse<any>) => {
                toast.success(data.data?.message) 
                setLoading("0")
                setisFriend("CONNECTFriend") 
            }
        }); 

        const handleadd = React.useCallback(() => {
            setLoading(userId) 
            addfriend.mutate({toUserID: userId}) 
        }, [])   

        const handleRemove = React.useCallback(() => {
            setLoading(userId) 
            unfriend.mutate() 
        }, []) 

    const blockSuggestion = async () => {
        const response = await httpService.post(BLOCK_USER, {
            blockType: "USER",
            id: userId,
        }) 
        console.log(response); 
    }

    return (
        <div ref={ref} className="flex flex-col gap-3 bg-chasescrollWhite rounded-b-3xl rounded-tl-3xl border border-chasescrollLightGrey shadow-lg px-3 pt-3 pb-6 w-40">
          <Popover className="relative w-fit self-end">
            <Popover.Button className="flex outline-none">
              <div className="flex self-end text-chasescrollBlue">
                <span className="cursor-pointer p-1 -mr-1">
                  <HollowEllipsisIcon />
                </span>
              </div>
            </Popover.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Popover.Panel className="absolute z-10 right-0 bg-white w-32 border border-gray-200 rounded-lg shadow-lg">
                {SUGGESTION_MENU.map((item: any, index: number) => (
                  <div
                    key={item.id}
                    onClick={blockSuggestion}
                    className={`text-center text-sm w-full px-2 py-3 cursor-pointer border-gray-200
                    ${index !== SUGGESTION_MENU.length - 1
                        ? "border-b"
                        : "border-none"
                      } ${isEven(index) ? "text-black" : "text-red-500"}`}
                  >
                    {item.label}
                  </div>
                ))}
              </Popover.Panel>
            </Transition>
          </Popover>

            <div className="flex flex-col lg:gap-2 gap-1 items-center">
                <div className="rounded-b-[64px] rounded-tl-[64px] w-20 h-20 border "> 
                    {data?.data?.imgMain?.value &&  
                        <img src={`https://chaseenv.chasescroll.com//resource-api/download/${data?.data?.imgMain?.value}`} alt="profiles" className="h-full w-full rounded-b-[34px] object-cover rounded-tl-[34px]" />
                    }
                    {!data?.data?.imgMain?.value && (
                        <div className=" w-full h-full bg-chasescrollGray rounded-b-[64px] rounded-tl-[64px] flex justify-center items-center font-bold text-[30px] " >
                            {data?.firstName?.charAt(0).toUpperCase()}{data?.lastName?.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
            </div> 
            <h1 onClick={() => navigate(`/profile/${userId}`)} className="font-bold text-center text-sm cursor-pointer">{firstName} {lastName}</h1>
            <h3 className="text-chasescrollGrey text-xs">
                {mutuals} Mutual Connection{mutuals === 1 ? "" : "s"}
            </h3>

            {(isFriend === "FRIEND_REQUEST_SENT" || isFriend === "CONNECTED" || isFriend === "CONNECTFriend") ?
                <button
                    onClick={handleRemove}
                    className={`flex items-center font-semibold justify-center rounded-md py-2 text-xs lg:text-sm w-28 transition-all bg-chasescrollRed text-white `}
                >
                    {Loading === userId ? "Loading..":isFriend === "FRIEND_REQUEST_SENT" ? "Pending" : isFriend === "CONNECTFriend" ? "Pending": "Disconnected"}
                </button>
            : 
                <button
                    onClick={handleadd}
                    className={`flex items-center font-semibold justify-center rounded-md py-2 text-xs lg:text-sm w-28 transition-all bg-chasescrollBlue text-white `} >
                    {Loading === userId? "Loading..": "Connect"}
                </button>
            }
        </div>
    )
})

export default UserTile
