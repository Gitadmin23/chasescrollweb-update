import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { MyConnect } from "@/constants"
import CONFIG from "../../../config"
import { ACCEPT_FRIEND_REQUEST, DECLINE_REQUEST, GET_FRIEND_REQUESTS, GET_USER_CONNECTION_LIST, REMOVE_FRIEND, SEND_FRIEND_REQUEST } from "../../../constants/endpoints.constant"
import { toast } from "react-toastify";
import { useFetch } from "../../../hooks/useFetch"
import { useAuth } from "../../../context/authContext"
import { REJECT_FRIEND_REQUEST } from "../../../constants/endpoints.constant"
import { PATH_NAMES } from "../../../constants/paths.constant"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Avatar } from '@chakra-ui/react';
import Loader from "../../../components/Loader"
import useInfinteScroller from "../../../hooks/useInfinteScroller"
import { useSearchParams } from 'react-router-dom';
import InfiniteScrollerComponent from "../../../hooks/infiniteScrollerComponent"
import httpService from "@/utils/httpService"
import {useQuery} from 'react-query'


const MyNetwork = (props) => {
  const [activeTab, setActiveTab] = useState("Connects")
  const [requests, setRequests] = useState([])
  const [network, setNetwork] = useState([])
  const [loadingRejected, setloadingRejected] = useState("")
  const [loadingAccept, setloadingAccept] = useState("")
  const [clicledUser, setclicledUser] = useState([])
  const [searchParams] = useSearchParams();
  // const [isLoading, setIsLoading] = React.useState(true)
  const { sendRequest } = useFetch() 
  const navigate = useNavigate()

  const { userId } = useParams()
  const { token, userId: currentUserId } = useAuth()
 
  const self = userId === currentUserId

  React.useEffect(() => {
    const page = searchParams.get('page');
    if (page === 'request') {
      setActiveTab('Requests');
    }

    if (page === 'Connect') {
      setActiveTab('Connect');
    }
  }, [searchParams])

  const handleTabChange = tab => {
    setActiveTab(tab)
  }

  const fetchRequests = async () => {
    const data = await sendRequest(
      GET_FRIEND_REQUESTS,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) setRequests(data)
    // setIsLoading(false)
  }

  

  const acceptRequest = async (id) => {
    setloadingAccept(id)
    const data = await sendRequest(
      "/user/accept-friend-request",
      "POST",
      { friendRequestID: id },
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message);
      setclicledUser([...clicledUser, id])
      fetchRequests()
    }
    setloadingAccept("")
  }

  const rejectRequest = async (id) => {
    setloadingRejected(id)
    const data = await sendRequest(
      REJECT_FRIEND_REQUEST+"/"+id,
      "DELETE",
      // { friendRequestID: id },
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message);
      setclicledUser([...clicledUser, id]) 
      // fetchRequests()

    }
    setloadingRejected("")
  }

  // const fetchNetwork = async () => {
  //   if (userId) {
  //     const data = await sendRequest(
  //       `${GET_USER_CONNECTION_LIST}${userId}`,
  //       "GET",
  //       null,
  //       { Authorization: `Bearer ${token}` }
  //     )
  //     if (data) setNetwork(data)
  //   }
  // }


  const friendPerson = async (item) => {
    // setLoading(true)
    const data = await sendRequest(
      `${SEND_FRIEND_REQUEST}`,
      "POST",
      { toUserID: userId },
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message);
      // fetchNetwork()

      // fetchProfileInfo()
    }
    // setLoading(false)
  }

  const unfriendPerson = async (item) => {
    // setLoading(true)
    const data = await sendRequest(
      `${REMOVE_FRIEND}${userId}`,
      "DELETE",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message);
      //fetchNetwork()

      //fetchProfileInfo()
    }
    // setLoading(false)
  }

  useEffect(()=>{ 
    if(props.active){
      setActiveTab(props.active)
    } 
  }, [userId])

  
  const [page, setPage] = React.useState(0)
  // const { results, isLoading, lastChildRef, refetch, data } = useInfinteScroller({url:'/user/friend-requests', pageNumber:page, setPageNumber:setPage})

  const {isLoading, isRefetching, results, ref} = InfiniteScrollerComponent({url:'/user/friend-requests', limit: 10})
 
  return (
    <div className="flex justify-center px-4 pb-8 w-full max-w-md mx-auto">

      {isLoading && (
        <> 
          {props?.active  === "Requests" && ( 
            <div className=" w-full py-6 flex justify-center " >
                <Loader />
            </div>
          )}
        </>
      )}
        <div className="flex flex-col justify-center w-full mb-[100px]">
          {self && (
            <div className="flex justify-center items-center px-1 py-1 bg-[#EFEFF0] rounded-lg mx-auto">
              <button
                className={`text-sm sm:text-base font-bold py-2 px-6 ${activeTab === "Connects"
                  ? "bg-white rounded-tl-md rounded-bl-md text-chasescrollBlue py-2 px-6 "
                  : "text-gray-400"
                  }`}
                onClick={() => {
                  handleTabChange("Connects")
                  // fetchNetwork()
                }}
              >
                Connects
              </button>
              <button
                className={`text-sm sm:text-base font-bold py-2 px-6 ${activeTab === "Requests"
                  ? "bg-white rounded-tr-md rounded-br-md text-chasescrollBlue py-2 px-6 "
                  : "text-gray-400"
                  }`}
                onClick={() => {
                  handleTabChange("Requests")
                  // fetchRequests()
                }}
              >
                Requests
              </button>
            </div>
          )}

          {!isLoading && (
            <> 
              {activeTab === "Requests" && (
                <> 
                  <div className="flex flex-col gap-6 justify-center items-center mt-10 w-full">
                    {results?.filter((item)=> !clicledUser.includes(item?.id))?.map(
                      ({ fromUserID, id }, i) => { 
                        if (results?.length === i + 1) {
                          return (
                            <div
                              className="flex justify-between items-center w-full"
                              key={id}
                              ref={ref}
                            >
                              <Link
                                to={`${PATH_NAMES.profile}/${id}`} 
                                className="flex gap-2 items-center"
                              >
                                {/* <img src={`${CONFIG.RESOURCE_URL}${fromUserID?.data?.imgMain?.value}`} alt="" className="w-12 h-12 rounded-b-full rounded-tl-full border border-chasescrollBlue object-cover" /> */}

                                <Avatar 
                                  src={`${CONFIG.RESOURCE_URL}${fromUserID?.data?.imgMain?.value}`}
                                  name={`${fromUserID?.firstName} ${fromUserID?.lastName}`}
                                />
                                <div className="inline-flex flex-col">
                                  <p className="text-l text-black-800 capitalize">
                                    {fromUserID?.firstName} {fromUserID?.lastName}
                                  </p>
                                  <small className="text-gray-500">@{fromUserID?.username}</small>
                                </div>
                              </Link>
                              <div className="flex gap-2">
                                <button
                                  className="px-4 py-2 bg-chasescrollBlue text-white rounded-md shadow-md font-bold"
                                  onClick={() => acceptRequest(id)}
                                >
                                  <span className="text-sm">
                                    {loadingAccept === id ? "Loading...": "Accept"}
                                  </span>
                                </button>
                                <button
                                  className="px-4 py-2 text-red-600 bg-pink-100 rounded-md shadow-md font-bold"
                                  onClick={() => rejectRequest(id)}
                                >
                                  <span className="text-sm">
                                    {loadingRejected === id ? "Loading..." : "Reject"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          )
                        } else { 
                          return (
                            <div
                              className="flex justify-between items-center w-full"
                              key={id}
                            >
                              <Link
                                to={`${PATH_NAMES.profile}/${userId}`} 
                                className="flex gap-2 items-center"
                              >
                                {/* <img src={`${CONFIG.RESOURCE_URL}${toUserID?.data?.imgMain?.value}`} alt="" className="w-12 h-12 rounded-b-full rounded-tl-full border border-chasescrollBlue object-cover" /> */}

                                <Avatar 
                                  src={`${CONFIG.RESOURCE_URL}${fromUserID?.data?.imgMain?.value}`}
                                  name={`${fromUserID?.firstName} ${fromUserID?.lastName}`}
                                />
                                <div className="inline-flex flex-col">
                                  <p className="text-l text-black-800 capitalize">
                                    {fromUserID?.firstName} {fromUserID?.lastName}
                                  </p>
                                  <small className="text-gray-500">@{fromUserID?.username}</small>
                                </div>
                              </Link>
                              <div className="flex gap-2">
                                <button
                                  className="px-4 py-2 bg-chasescrollBlue text-white rounded-md shadow-md font-bold"
                                  onClick={() => acceptRequest(id)}
                                >
                                  <span className="text-sm">
                                    {loadingAccept === id ? "Loading...": "Accept"}
                                  </span>
                                </button>
                                <button
                                  className="px-4 py-2 text-red-600 bg-pink-100 rounded-md shadow-md font-bold"
                                  onClick={() => rejectRequest(id)}
                                >
                                  <span className="text-sm">
                                    {loadingRejected === id ? "Loading..." : "Reject"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          )
                        }
                      }
                    )}
                  </div>
                  {results.length < 1 && ( 
                    <div className=' w-full py-2 flex justify-center font-bold text-2xl ' >
                      No Records Found
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {activeTab === "Connects" && ( 
            <ConnectTab reload={props.reload} />
          )}
        </div> 
    </div >
  )
}

const ConnectTab =(props)=> {
  const { userId } = useParams()
  const { token, userId: currentUserId } = useAuth()
  const { sendRequest } = useFetch() 
  const [network, setNetwork] = useState([])
  const [loading, setLoading] = useState("")
  const self = userId === currentUserId
  const intObserver = React.useRef();


  const [page, setPage] = React.useState(0)
  // const [results, setResults] = useState([]);
  // const { isLoading, data,} = useQuery(['getConnections', userId], () => httpService.get(`/user/get-users-connections/${userId}`), {
  //   onSuccess: (data) => { 
  //     setResults(data?.data?.);
  //   }
  // });

  const {isLoading, isRefetching, results, ref} = InfiniteScrollerComponent({url:`/user/get-users-connections/${userId}`, limit: 10})
 
  const friendPerson = async (item) => {
    setLoading(item)
    const data = await sendRequest(
      `${SEND_FRIEND_REQUEST}`,
      "POST",
      { toUserID: item },
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message); 
    }
    setLoading("")
  } 

  const unfriendPerson = async (item) => {
    setLoading(item)
    const data = await sendRequest(
      `${REMOVE_FRIEND}${item}`,
      "DELETE",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message); 
      setNetwork([...network, item])
      props.reload()
    }
    setLoading("")
  } 

  const UserTile =(props)=> {
    
    const {
      profile
    } = props

    const [isFriend, setisFriend] = useState(profile?.joinStatus)

    return( 
      <div
          className="flex justify-between items-center" 
        >
        <Link
          to={`${PATH_NAMES.profile}/${profile.userId}`}
          className="flex gap-2 items-center"
        > 
          <Avatar 
              src={`${CONFIG.RESOURCE_URL}${profile?.data?.imgMain?.value}`}
              className="rounded-b-full rounded-tl-full object-cover w-12 h-12 border border-chasescrollBlue"
              name={`${profile?.firstName} ${profile.lastName}`}
          />
          <div className="inline-flex flex-col">
            <p className="text-l text-black-800">
              {profile?.firstName} {profile?.lastName}
            </p>
            <small className="text-gray-500">@{profile?.username}</small>
          </div>
        </Link> 

            {(isFriend === "FRIEND_REQUEST_RECIEVED" || isFriend === "FRIEND_REQUEST_SENT" || isFriend === "CONNECTED" || isFriend === "CONNECTFriend") ?
              <>
                {profile?.publicProfile ? 
                    <button
                      onClick={() => unfriendPerson(profile?.userId)}
                      className={`flex items-center font-semibold justify-center rounded-md py-2 text-xs px-4 lg:text-sm transition-all bg-chasescrollRed text-white `}
                    >
                      {loading === userId ? "Loading..":isFriend === "FRIEND_REQUEST_SENT" ? "Pending" : isFriend === "CONNECTFriend" ? "Disconnected": "Disconnected"}
                    </button>
                  :
                    <button
                      onClick={() => unfriendPerson(profile?.userId)}
                      className={`flex items-center font-semibold justify-center rounded-md py-2 text-xs px-4 lg:text-sm transition-all bg-chasescrollRed text-white `}
                    >
                      {loading === userId ? "Loading..":isFriend === "FRIEND_REQUEST_SENT" ? "Pending" : isFriend === "CONNECTFriend" ? "Pending": "Disconnected"}
                    </button>
                }
              </>
              : isFriend === "SELF" ? (
              <>
              </>
            ) 
            : 
              <button
                  onClick={() => friendPerson(profile?.userId)}
                  className={`flex items-center font-semibold justify-center rounded-md py-2 text-xs px-4 lg:text-sm transition-all bg-chasescrollBlue text-white `} >
                  {loading === userId? "Loading..": "Connect"}
              </button>
            }
        {/* )} */}
      </div>
    )
  } 

  return( 
    <div className="flex flex-col w-full my-6 mb-[100px]"> 
      {!isLoading && (
        <> 
          {results?.filter((item)=> !network.includes(item?.userId))?.map((profile, i) => {   
            if (results?.length === i + 1) {
              return( 
                <div key={profile?.id} className=" my-4 " >
                  <UserTile profile={profile} />
                </div>
              )
            } else { 
              return( 
                <div key={profile?.id} className=" my-4 " >
                  <UserTile profile={profile} />
                </div>
              )
            }
          })}
        </>
      )} 
    </div>
  )
}

MyNetwork.propTypes = {
  network: PropTypes.array
}

export default MyNetwork
