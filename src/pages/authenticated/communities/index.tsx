/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react"
import PageWrapper from "../../../components/PageWrapper"
import { AddIcon } from "../../../components/Svgs"
import { useAuth } from "../../../context/authContext"
import { GET_ALL_PUBLIC_GROUPS_TO_JOIN, GET_GROUP_REQUESTS } from "../../../constants/endpoints.constant"
import { GET_JOINED_GROUPS } from "../../../constants/endpoints.constant"
import { PATH_NAMES } from "../../../constants/paths.constant"
import { Link } from "react-router-dom"
import { useQuery } from "react-query"
import httpService, { unsecureHttpService } from "../../../utils/httpService"
import MyCommunities from "../../../components/communities/MyCommunities"
import FindCommunities from "../../../components/communities/FindCommunities"
import Requests from "../../../components/communities/Requests"
import useDebounce from "../../../hooks/useDebounce"

const ACTIVE = "flex-1 bg-chasescrollBlue text-white text-md flex justify-center items-center cursor-pointer";
const INACCTIVE = "flex-1 text-black flex text-md justify-center items-center cursor-pointer";

const Communities = () => {
  const [communities, setCommunities] = useState<any[]>([])
  const [myCommunities, setMyCommunities] = useState<Array<any>>([])
  const [requestedCommunities, setRequestedCommunities] = useState<any[]>([])
  const [active, setActive] = useState(1);
  const [searchText, setSearchText] = useState('');
  const searchVal = useDebounce(searchText);

  const {  userId } = useAuth()

  // react-query
  const getMyCommunities = useQuery(['getMyCommunities', userId], () => httpService.get(`${GET_JOINED_GROUPS}?userID=${userId}`), {
    onSuccess: (data) => {
      setMyCommunities(data.data.content);
    }
  });

  const getCommunities = useQuery(['getCommunities', searchVal], () => unsecureHttpService.get(`/group/group`, {
    params: {
      searchText: searchVal
    }
  }), {
    onSuccess: (data) => {
      setCommunities(data.data.content);
    }
  });

  const getRequests = useQuery(['getRequests', userId], () => httpService.get(`${GET_GROUP_REQUESTS}${userId}`), {
    onSuccess: (data) => {
      setRequestedCommunities(data.data.content)
    }
  });

  const handleRefechCommunities = useCallback(async() => {
      await getCommunities.refetch()
  }, [getCommunities]);


  const SwitchTab = useCallback(() => {
    switch(active) {
      case 1: {
        return <MyCommunities communities={myCommunities} loading={getMyCommunities.isLoading} hasError={getMyCommunities.isError} />
      }
      case 2: {
        return <FindCommunities communities={communities} loading={getCommunities.isLoading} hasError={getCommunities.isError} searchText={searchText} handleSearch={setSearchText} search={handleRefechCommunities} />
      }
      case 3: {
        return <Requests />
      }
    }
  }, [active, myCommunities, getMyCommunities.isLoading, getMyCommunities.isError, communities, getCommunities.isLoading, getCommunities.isError, searchText, handleRefechCommunities]);

  return (
    <PageWrapper>
      {() => (
        <div className="w-full h-full flex flex-col">

          {/* TAB */}

          <div className="w-full h-16 flex">
            <div className={active === 1 ? ACTIVE:INACCTIVE} onClick={() => setActive(1)}>My Community</div>
            <div className={active === 2 ? ACTIVE:INACCTIVE} onClick={() => setActive(2)}>Find community</div>
            <div className={active === 3 ? ACTIVE:INACCTIVE} onClick={() => setActive(3)}>Request</div>
          </div>

          <div className="w-full flex-1 overflow-y-auto overflow-x-hidden flex flex-col xl:px-10 px-4">
            {/* CREATE COMUNITY BUTTON */}
            <div className="flex w-full justify-end items-center pr-10">
              <Link to={PATH_NAMES.createCommunity} className="self-end p-4">
                <div className="flex">
                  <AddIcon />
                  <p className="text-chasescrollBlue text-md ml-2">Create Community</p>
                </div>
              </Link>
              
            </div>
            <div className="w-full">
              {SwitchTab()}
            </div>
          </div>

        </div>
      )}
    </PageWrapper >
  )
}

export default Communities
