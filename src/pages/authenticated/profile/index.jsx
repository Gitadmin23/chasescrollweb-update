import React, { useEffect, useState } from "react"
import PageWrapper from "@/components/PageWrapper"
import banner from "@/assets/images/concert.jpeg"
import CONFIG from "@/config"
import { MoreSquare } from "@/components/Svgs"
import { SettingsOptionPopup } from "./modals/SettingsPopup"
import Posts from "./Posts"
import MyNetwork from "./MyNetwork"
import SecondaryEvents from "./SecondaryEvents"
import SecondaryCommunity from "./SecondaryCommunity"
import SecondaryNavbar from "./SecondaryNavbar"
import { PATH_NAMES } from "../../../constants/paths.constant"
import { Link, useNavigate, useParams } from "react-router-dom"
import { SecondMenuIcon } from "../../../components/Svgs"
import { useFetch } from "../../../hooks/useFetch"
import { GET_FRIEND_REQUESTS, GET_JOINED_EVENTS, GET_JOINED_GROUPS, GET_USER_CONNECTION_LIST, GET_USER_MEDIA_POSTS, GET_USER_PRIVATE_PROFILE, REMOVE_FRIEND, SEND_FRIEND_REQUEST } from "../../../constants/endpoints.constant"
import { useAuth } from "../../../context/authContext"
import { toast } from "react-toastify"
import { IoMdSettings } from 'react-icons/io'
import { Avatar, Spinner } from '@chakra-ui/react'
import Loader from "../../../components/Loader"
import { useMutation } from "react-query"
import httpService from "@/utils/httpService"
import { useSearchParams } from 'react-router-dom';

const Profile_1 = () => {
  const [showOptions, setShowOptions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({})
  const [displayConnect, setDisplayConnect] = useState(true)
  const [posts, setPosts] = useState([])
  const [network, setNetwork] = useState([])
  const [ownNetwork, setOwnNetwork] = useState([])
  const [events, setEvents] = useState([])
  const [communities, setCommunities] = useState([])

  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');

  const [activeComponent, setActiveComponent] = useState(page === 'request' ? 'component2' : 'component1')

  if (page !== null && page === 'request') {
    //setActiveComponent('component2')
  }

  // React.useEffect(() => {

  //   if (page === 'request') {
  //     setActiveComponent('component2');
  //   }
  // }, []);

  const { userId } = useParams()
  const navigate = useNavigate()


  const { sendRequest } = useFetch()
  const { token, userId: currentUserId } = useAuth()

  const self = userId === currentUserId

  // mutation
  const { isLoading: createChatLoading, mutate } = useMutation({
    mutationFn: () => httpService.post('/chat/chat', {
      image: `${profile?.data?.imgMain?.value}`,
      name: profile?.username,
      type: 'ONE_TO_ONE',
      typeID: userId,
      users: [
        userId,
      ]
    }),
    onSuccess: (data) => {
      navigate(`/message?messageId=${data.data.id}`);
    },
    onError: (errror) => {
      toast.error('An error occured whilw trying to initiate chat');
    }
  })

  const fetchProfileInfo = async () => {
    const data = await sendRequest(
      "/user/publicprofile/" + userId,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    )

    if (data) {
      setProfile(data)
      setIsLoading(false)
      //setActiveComponent("component1")
    }
  }

  const fetchPosts = async () => {
    const data = await sendRequest(
      `${GET_USER_MEDIA_POSTS}?userID=${userId}`,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) setPosts(data)
  }

  const fetchOwnNetwork = async () => {
    if (userId) {
      const data = await sendRequest(
        `${GET_USER_CONNECTION_LIST}${currentUserId}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      )
      if (data) setOwnNetwork(data)
    }
  }

  const fetchNetwork = React.useCallback(async () => {
    if (userId) {
      const data = await sendRequest(
        `${GET_USER_CONNECTION_LIST}${userId}`,
        "GET",
        null,
        { Authorization: `Bearer ${token}` }
      )
      if (data) setNetwork(data)
    }
  }, [sendRequest, token, userId])

  const fetchEvents = async () => {
    const data = await sendRequest(
      `${GET_JOINED_EVENTS}${userId}`,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) setEvents(data)
  }

  const fetchCommunities = async () => {
    const data = await sendRequest(
      `${GET_JOINED_GROUPS}?userID=${userId}`,
      "GET",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) setCommunities(data)
  } 

  const friendPerson = async () => {
    setLoading(true)
    const data = await sendRequest(
      `${SEND_FRIEND_REQUEST}`,
      "POST",
      { toUserID: userId },

      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message);
      fetchNetwork()
      fetchProfileInfo()
    }
    setLoading(false)
  }

  const unfriendPerson = async () => {
    setLoading(true)
    const data = await sendRequest(
      `${REMOVE_FRIEND}${userId}`,
      "DELETE",
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (data) {
      toast.success(data.message);
      fetchNetwork()
      fetchProfileInfo()
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfileInfo()
    fetchPosts()
    fetchOwnNetwork()
    fetchEvents()
    fetchCommunities()
    fetchNetwork()
  }, [userId])

  // useEffect(() => {
  //   if (ownNetwork) {
  //     const isMyFriend = ownNetwork.some(connect => connect.userId === userId)

  //     if (isMyFriend) setDisplayConnect(false)
  //     else setDisplayConnect(true)
  //   }
  // }, [network])

  const handleButtonClick = componentName => {
    if (
      componentName.type === "component1" ||
      componentName.type === "component2" ||
      componentName.type === "component3" ||
      componentName.type === "component4"
    ) {
      setActiveComponent(componentName.type)
    }
  }

  const switchComponent = React.useCallback(() => {

    const obj = {
      'component1': <Posts posts={posts?.content} />,
      'component2': <MyNetwork reload={fetchNetwork} />,
      'component3': <SecondaryEvents events={events} />,
      'component4': <SecondaryCommunity />,
    }

    return obj[activeComponent];
  }, [activeComponent, events, fetchNetwork, posts?.content])



  const handleShowOptions = () => {
    navigate('/settings');
  }


  return (
    <PageWrapper>
      {() => (
        <>
          {isLoading && (
            <div className=" w-full py-6 flex justify-center " >
              <Loader />
            </div>
          )}
          {!isLoading && (
            <div>
              <section className="flex relative flex-col mb-5 pb-6 w-full text-chasescrollBlue border-b-2 border-b-gray-200 h-auto">
                <div className="grid place-items-center relative">
                  <div className="h-96 w-full relative">
                    <div className="absolute w-full h-96 bg-[#00000045] inset-0" />
                    <img
                      src={`${CONFIG.RESOURCE_URL}${profile?.data?.imgMain?.value}`}
                      alt="user cover background"
                      className="w-full h-full object-cover"
                    />
                    <div className="backdrop-blur-md absolute inset-0 flex justify-start items-end pb-32 md:pb-32 px-4">
                      <Avatar
                        src={`${CONFIG.RESOURCE_URL}${profile?.data?.imgMain?.value}`}
                        alt="user profile photo"
                        className="border-2 border-white w-40 h-40 rounded-b-full rounded-tl-full shadow-md object-cover mb-10"
                        name={`${profile?.firstName} ${profile?.lastName}`}
                        size='2xl'
                      />
                    </div>
                  </div>
                  <div className="absolute flex justify-between top-6 left-0 right-0 px-4 w-full">
                    <div className="text-white"></div>
                    {self && (
                      <div
                        onClick={handleShowOptions}
                        className="cursor-pointer py-1 px-3 text-white bg-chasescrollBlue gap-1 rounded-[8px] flex items-center"
                      >
                        {/* <SecondMenuIcon /> */}
                        <IoMdSettings size="25px" fontSize='30px' color='white' />
                        <p>Settings</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-4 md:py-6 absolute flex flex-col gap-4  md:flex-row justify-center md:justify-between w-full h-auto bg-black bg-opacity-50 font-bold bottom-[0px]">
                    <div className="text-white self-start flex flex-col">
                      <h2 className="capitalize">{profile?.firstName} {profile?.lastName}</h2>
                      <small>@{profile?.username}</small>
                      {profile?.showEmail && (
                        <small>{profile?.email}</small>
                      )}
                      <small>Bio - {profile?.data.about?.value || 'NONE'}</small>
                      <small>Website - {profile?.data.webAddress?.value || 'NONE'}</small>
                    </div>
                    {!self && (
                      <div className="flex items-center gap-4 justify-center text-sm md:text-base">
                        {/* {profile?.joinStatus === "FRIEND_REQUEST_SENT" } */}
                        {!self && (
                          <div
                            onClick={mutate}
                            className="w-40 bg-white text-blue-500 px-4 py-3 rounded-md text-center"
                          >
                            {createChatLoading && <Spinner colorScheme="blue" />}
                            {!createChatLoading && 'Chat'}
                          </div>
                        )}
                        {profile?.joinStatus === "FRIEND_REQUEST_SENT" ? (
                          <button
                            className="w-40 font-semibold bg-[#F04F4F] text-white px-3 md:px-4 py-3 rounded-md"
                            onClick={unfriendPerson}
                          >
                            {loading ? "loading.." : "Pending"}
                          </button>
                        ) : profile?.joinStatus === "CONNECTED" ? (
                          <button
                            className="w-40 font-semibold bg-[#F04F4F] text-white px-3 md:px-4 py-3 rounded-md"
                            onClick={unfriendPerson}
                          >
                            {loading ? "loading.." : "Disconnect"}
                          </button>
                        ) : (
                          <button
                            className="w-40 font-semibold bg-chasescrollBlue text-white px-3 md:px-4 py-3 rounded-md"
                            onClick={friendPerson}
                          >
                            {loading ? "loading.." : "Connect"}
                          </button>
                        )}

                      </div>
                    )}
                  </div>
                </div>
                <SecondaryNavbar
                  activeComponent={activeComponent}
                  handleButtonClick={handleButtonClick}
                  networkCount={network?.length}
                  postCount={posts?.totalElements}
                  eventCount={events?.totalElements}
                  communityCount={communities?.totalElements}
                />
              </section>
              <div className="px-2 py-10  ">
                {switchComponent()}
              </div>
            </div>
          )}
          {showOptions && (
            <SettingsOptionPopup handleShowOptions={handleShowOptions} />
          )}
        </>
      )}
    </PageWrapper>
  )
}

export default Profile_1
