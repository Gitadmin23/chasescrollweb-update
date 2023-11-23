/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from 'react-router-dom';
import CONFIG from '../../config';
import { PATH_NAMES } from '../../constants/paths.constant';
import { useMutation, useQueryClient } from 'react-query';
import httpService from '../../utils/httpService';
import { JOIN_GROUP, LEAVE_GROUP } from '../../constants/endpoints.constant';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import { useAuth } from '../../context/authContext';
import { useCallback } from 'react'

interface IProps {
  communities: Array<any>;
  loading: boolean;
  hasError: boolean;
  searchText: string;
  handleSearch: (data:string) => void;
  search: () => void
}

const Community = ({ community, search }) => {
  const { userId } = useAuth()
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ groupID }: { groupID: string }) => httpService.post(`${JOIN_GROUP}`, { groupID, joinID: userId }),
    onSuccess: (data: any) => {
      // call fetchCommunities
      toast.success(data.data.message);
      queryClient.invalidateQueries(['getCommunities', search]);
      queryClient.invalidateQueries(['getMyCommunities', userId]);
    }
  });

  const leaveGroup = useMutation({
    mutationFn: ({ groupID }: { groupID: string}) => httpService.delete(`${LEAVE_GROUP}?groupID=${groupID}&userID=${userId}`),
    onSuccess: (data: any) => {
      // call fetchCommunities
      toast.success(data.data.message);
      queryClient.invalidateQueries(['getCommunities']);
      queryClient.invalidateQueries(['getMyCommunities', userId]);
    }
  });

  return (
    <div
      key={community.id}
      className="py-4 flex items-center gap-4 w-full max-w-2xl border-b border-blue-600 border-opacity-40"
    >
      <div className="border-chasescrollBlue border-l-8 rounded-b-full rounded-tl-full">
        <Link 
          to={`${PATH_NAMES.communityInfo}/${community.id}?info=true`}
        >
          <img
            src={community.data.imgSrc ? `${CONFIG.RESOURCE_URL}/${community.data.imgSrc}` : `https://ui-avatars.com/api/?background=random&name=${community.data.name}&length=1`}
            alt={community.name}
            className="flex-grow w-[50px] max-w-[96px] h-[50px] object-cover border-l-4 border-white rounded-b-full rounded-tl-full"
          />
        </Link>
      </div>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-col gap-3">
          <Link to={`${PATH_NAMES.communityInfo}/${community.id}?info=true`} className="font-medium text-lg md:text-2xl">
            {community.data.name}
          </Link>
          <div className="text-sm md:text-base opacity-[50%]">
            {community.data.description}
          </div>
          <div className={ community.data.isPublic ? "w-16 h-6 rounded-lg flex justify-center items-center  text-white bg-chasescrollBlue":"w-16 h-6 rounded-lg flex justify-center items-center  text-white bg-red-500"}>
            <p className=''>{community.data.isPublic ? 'Public' : 'Private'}</p>
          </div>
        </div>
        {community.joinStatus === 'REQUEST_PENDING' && (
            <p className='text-xl text-red-500'>REQUEST PENDING</p>
        )}
        {community.joinStatus === 'CONNECTED' && (
            <button
                className="text-xs md:text-sm bg-red-400 hover:bg-red-300 text-white font-bold px-4 py-2 md:py-[10px] md:px-[42px] rounded-lg"
                onClick={() => leaveGroup.mutate({ groupID: community.id })}
              >
            { !leaveGroup.isLoading && 'Leave group'}
            {leaveGroup.isLoading && 'Loading'}
          </button>
        )}
        {(
          <button
            className="text-xs md:text-sm bg-[#5D70F9] hover:bg-blue-700 text-white font-bold px-4 py-2 md:py-[10px] md:px-[42px] rounded-lg"
            onClick={() => mutate({ groupID: community.id  })}
          >
            {!isLoading && 'Join'}
            {isLoading && 'Loading'}
          </button>
        )}
      </div>
    </div>
  )
}

function FindCommunities({ communities, loading, hasError, searchText, handleSearch, search }: IProps) {

  const handleChange = useCallback((e) => {
    e.preventDefault();
      handleSearch(e.target.value);
  }, [handleSearch])

  if (loading) {
    return (
      <div className='w-full flex justify-center items-center'>
        <Loader />
      </div>
    )
  }

  if (!loading && hasError) {
    return (
      <div className="w-full flex justify-center items-center">
        <p className='text-4xl'>An error occured</p>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-32 flex justify-center items-center">
        <input value={searchText} onChange={(e) =>handleChange(e)} onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            search();
          }
        }} className='w-96 h-10 rounded-lg border-[1px] border-chasescrollBlue bg-blue-100 px-4 py-2' type='text' placeholder='Search communities' />
      </div>
      { !loading && !hasError && communities.length < 1 && (
          <div className="w-full h-24 flex justify-center items-center">
            <p className='text-xl text-gray-500'>No communities found!</p>
          </div>
      )}
      {communities?.map((community, i) => (
        <Community community={community} key={i} search={searchText} />
      ))}
    </div>
  )
}

export default FindCommunities