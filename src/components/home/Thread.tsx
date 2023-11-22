import { useState, forwardRef } from "react"
import { Link } from "react-router-dom"
import {
  CommentsIcon,
  EmptyHeartIcon,
  FilledHeartIcon,
  HollowEllipsisIcon,
} from "../Svgs"
import { formatNumberWithK } from "../../utils/helpers"
import { PATH_NAMES } from "../../constants/paths.constant"
import ProfilePhoto from "../ProfilePhoto"

import {
  GET_POST,
  LIKE_POST,
} from "../../constants/endpoints.constant"
import { useFetch } from "../../hooks/useFetch"
import { useAuth } from "../../context/authContext"
import CONFIG from "../../config"
import BlurredImage from "../BlurredImage"
import { formatTimeAgo } from "../../utils/helpers"
import { COMPANY_NAME } from "../../constants"
import VideoPlayer from "../VideoPlayer"
import PhotoGallery from "../PhotoGallery"
import { Avatar, Spinner, VStack } from '@chakra-ui/react'
import { IMediaContent } from "../../models/MediaPost"
import { useMutation, useQuery, useQueryClient } from "react-query"
import httpService from "../../utils/httpService"
import { toast } from "react-toastify"
import OverlayWrapper from "../OverlayWrapper"
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

interface IProps {
  setThreadId: (id: string) => void;
  toggleMoreOptions: () => void;
  toggleShare: () => void;
  setPostId: (id: string) => void;
  setPostMakeId: (id: string) => void;
  post: IMediaContent
}

const Thread = forwardRef<any, IProps>
(({
  post: postData,
  setThreadId,
  toggleMoreOptions,
  setPostId,
  setPostMakeId,
}, ref) => {
  const [post, setPost] = useState<any>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(0);
  const [showMore, setShowMore] = useState(false)
  //const { token, userId } = useAuth()
  const { sendRequest } = useFetch()
  const queryClient = useQueryClient();

  //const { user, text, time, type, multipleMediaRef, mediaRef, id: postID, commentCount } = post;

  const getPost = useQuery([`getPost-${postData?.id}`, postData?.id], () => httpService.get(`${GET_POST}/${postData?.id}`), {
    onSuccess:  (data) => {
      setPost(data.data);
      setIsLiked(data.data.likeStatus === 'LIKED');
      setNumOfLikes(data.data.likeCount);
    }
  });

  const { isLoading, mutate } = useMutation({
    mutationFn: () => httpService.post(`${LIKE_POST}/${postData?.id}`),
    onSuccess: (data) => {
      // console.log(data.data);
      // queryClient.invalidateQueries(['getFeedsPosts']);
      // queryClient.refetchQueries(['getFeedsPosts']);
      //setPost(data.data);
      setIsLiked(data.data.likeStatus === 'LIKED');
      setNumOfLikes(data.data.likeCount);
    },  
    onError: (data) => {
      toast.error('An error occured');
    },
  })

  const toggleLike = async () => {
    mutate();
  }  

  if (!ref) {
    return (
      <div id={postData?.id} className="flex bg-white flex-col gap-4 justify-between p-5 w-full border border-opacity-50 border-gray-200 rounded-tl-[32px] rounded-b-[32px] shadow-xl h-fit  ">
       

        <div className="flex justify-between items-stretch text-black lg:w-full sm:w-full">
          <Link
            className="flex gap-2 items-center"
            to={`${PATH_NAMES.profile}/${postData?.user?.userId}`}
          >
            { post?.user?.data?.imgMain?.value && (
              <ProfilePhoto image={post?.user?.data?.imgMain?.value ? `${CONFIG.RESOURCE_URL}/${post?.user?.data?.imgMain?.value}` : `https://ui-avatars.com/api/?background=random&name=${post?.user?.firstName}&length=1`} />
            )}
            {
              !post?.user?.data?.imgMain?.value && (
                <Avatar 
                  name={`${post?.user?.firstName} ${post?.user?.lastName}`}
                  size='md'
                />
              )
            }
            <div className="flex flex-col capitalize">
              <small>{post?.user?.firstName} {post?.user?.lastName}</small>
              <div className="flex flex-col">
                {/* <small>{post?.user?.data?.city?.value ?? COMPANY_NAME}, {post?.user?.data?.country?.value}</small> */}
                <small className="text-[10px] opacity-60">{formatTimeAgo(post?.time?.millis)}</small>
              </div>
            </div>
          </Link>
          <span
            className="cursor-pointer flex pt-4 text-chasescrollBlue"
            onClick={() => {
              toggleMoreOptions()
              setThreadId(post?.id);
              setPostId(post?.id);
              setPostMakeId(post?.user?.userId)
            }}
          >
            <HollowEllipsisIcon />
          </span>
        </div>
        <div
          className='text-md font-normal'
        >
          { post?.text && post?.text?.length < 100 && (
            <span>{post?.text}</span>
          )}
          {post?.text && showMore && (
            <span>{ post?.text } <span onClick={() => setShowMore(!showMore)} className="text-chasescrollBlue cursor-pointer">Show Less</span></span>
          )}
          {post?.text && !showMore && post?.text.length > 100 && (
            <span>{post?.text.substring(0, 100)}... <span onClick={() => setShowMore(!showMore)} className="text-chasescrollBlue cursor-pointer">Show More</span></span>
          )}
        </div>
        <div className="flex flex-col gap-3"> 
          {post?.type === "WITH_IMAGE" && post?.multipleMediaRef?.length > 1 && (
            <div onDoubleClick={() => toggleLike()}>
              <PhotoGallery images={post?.multipleMediaRef} />
            </div>
          )}
          {!post?.multipleMediaRef && (
            <>
              {post?.type === "WITH_IMAGE" && (
                <div onDoubleClick={() => toggleLike()}>
                  <BlurredImage imageUrl={post.mediaRef?.includes("https:") ? post?.mediaRef : `${CONFIG.RESOURCE_URL}/${post?.mediaRef}`} />
                </div>
              )}
            </>
          )}
          {post?.multipleMediaRef && (
            <>
              {post?.type === "WITH_IMAGE" && post?.multipleMediaRef?.length <= 1 && (
                <div onDoubleClick={() => toggleLike()}>
                  <BlurredImage imageUrl={post.mediaRef?.includes("https:") ? post?.mediaRef : `${CONFIG.RESOURCE_URL}/${post?.mediaRef}`} />
                </div>
              )}
            </>
          )} 
          {post?.type === "WITH_VIDEO_POST" && (
            <VideoPlayer videoUrl={post?.mediaRef.startsWith('https') ? post?.mediaRef: `${CONFIG.RESOURCE_URL}/${post?.mediaRef}`} />
          )}
          <div className="flex justify-between ">
            <div className="basis-1/3 flex items-center justify-center">
            {
            !isLoading && (
              <div className="flex flex-col items-center justify-center text-chasescrollTextGrey">
              <div
                className="cursor-pointer transition-all"
                onClick={() => toggleLike()}
              >
                {isLiked ? <FilledHeartIcon /> : <EmptyHeartIcon />}
              </div>
              <span className="text-xs text-chasescrollTextGrey">
                {formatNumberWithK(numOfLikes)}{" "}
                like{numOfLikes > 1 || numOfLikes === 0 ? "s" : ""}
              </span>
            </div>
            )
          }
          {
            isLoading && (
              <Spinner />
            )
          }
            </div>
            <div className="basis-1/3 flex items-center justify-center">
              <Link
                to={`${PATH_NAMES.comments}/${post?.id}`}
                className="text-xs"
              >
                <div className="flex flex-col items-center justify-center text-chasescrollTextGrey">
                  <CommentsIcon />
                  {formatNumberWithK(post?.commentCount)} comments
                </div>
              </Link>
            </div>
            {/* <div className="basis-1/3 flex items-center justify-center">
              <div
                className="flex flex-col items-center justify-center text-chasescrollTextGrey"
                onClick={toggleShare}
              >
                <UploadIcon />
                <span className="cursor-pointer text-xs text-chasescrollTextGrey">
                  {formatNumberWithK(shareCount)} shares
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    )
  }

  if (getPost.isLoading) {
    return (
      <VStack className="flex flex-col gap-4 justify-between p-5 w-full border border-opacity-50 border-gray-200 rounded-tl-[32px] rounded-b-[32px] shadow-xl h-fit bg-white ">
        <p>Loading...</p>
      </VStack>
    )
  }

  return (
    <div ref={ref} id={postData?.id} className="flex bg-white flex-col gap-4 justify-between p-5 w-full border border-opacity-50 border-gray-200 rounded-tl-[32px] rounded-b-[32px] shadow-xl h-fit  ">
       

        <div className="flex justify-between items-stretch text-black lg:w-full sm:w-full">
          <Link
            className="flex gap-2 items-center"
            to={`${PATH_NAMES.profile}/${postData?.user?.userId}`}
          >
            { post?.user?.data?.imgMain?.value && (
              <ProfilePhoto image={post?.user?.data?.imgMain?.value ? `${CONFIG.RESOURCE_URL}/${post?.user?.data?.imgMain?.value}` : `https://ui-avatars.com/api/?background=random&name=${post?.user?.firstName}&length=1`} />
            )}
            {
              !post?.user?.data?.imgMain?.value && (
                <Avatar 
                  name={`${post?.user?.firstName} ${post?.user?.lastName}`}
                  size='md'
                />
              )
            }
            <div className="flex flex-col capitalize">
              <small>{post?.user?.firstName} {post?.user?.lastName}</small>
              <div className="flex flex-col">
                {/* <small>{post?.user?.data?.city?.value ?? COMPANY_NAME}, {post?.user?.data?.country?.value}</small> */}
                <small className="text-[10px] opacity-60">{formatTimeAgo(post?.time?.millis)}</small>
              </div>
            </div>
          </Link>
          <span
            className="cursor-pointer flex pt-4 text-chasescrollBlue"
            onClick={() => {
              toggleMoreOptions()
              setThreadId(post?.id);
              setPostId(post?.id);
              setPostMakeId(post?.user?.userId)
            }}
          >
            <HollowEllipsisIcon />
          </span>
        </div>
        <div
          className='text-md font-normal'
        >
          { post?.text && post?.text?.length < 100 && (
            <span>{post?.text}</span>
          )}
          {post?.text && showMore && (
            <span>{ post?.text } <span onClick={() => setShowMore(!showMore)} className="text-chasescrollBlue cursor-pointer">Show Less</span></span>
          )}
          {post?.text && !showMore && post?.text.length > 100 && (
            <span>{post?.text.substring(0, 100)}... <span onClick={() => setShowMore(!showMore)} className="text-chasescrollBlue cursor-pointer">Show More</span></span>
          )}
        </div>
        <div className="flex flex-col gap-3"> 
          {post?.type === "WITH_IMAGE" && post?.multipleMediaRef?.length > 1 && (
            <div onDoubleClick={() => toggleLike()}>
              <PhotoGallery images={post?.multipleMediaRef} />
            </div>
          )}
          {!post?.multipleMediaRef && (
            <>
              {post?.type === "WITH_IMAGE" && (
                <div onDoubleClick={() => toggleLike()}>
                  <BlurredImage imageUrl={`${CONFIG.RESOURCE_URL}/${post?.mediaRef}`} />
                </div>
              )}
            </>
          )}
          {post?.multipleMediaRef && (
            <>
              {post?.type === "WITH_IMAGE" && post?.multipleMediaRef?.length <= 1 && (
                <div onDoubleClick={() => toggleLike()}>
                  <BlurredImage imageUrl={`${CONFIG.RESOURCE_URL}/${post?.mediaRef}`} />
                </div>
              )}
            </>
          )} 
          {post?.type === "WITH_VIDEO_POST" && (
            <VideoPlayer videoUrl={post?.mediaRef.startsWith('https') ? post?.mediaRef: `${CONFIG.RESOURCE_URL}/${post?.mediaRef}`} />
          )}
          <div className="flex justify-between ">
            <div className="basis-1/3 flex items-center justify-center">
            {
            !isLoading && (
              <div className="flex flex-col items-center justify-center text-chasescrollTextGrey">
              <div
                className="cursor-pointer transition-all"
                onClick={() => toggleLike()}
              >
                {isLiked ? <FilledHeartIcon /> : <EmptyHeartIcon />}
              </div>
              <span className="text-xs text-chasescrollTextGrey">
                {formatNumberWithK(numOfLikes)}{" "}
                like{numOfLikes > 1 || numOfLikes === 0 ? "s" : ""}
              </span>
            </div>
            )
          }
          {
            isLoading && (
              <Spinner />
            )
          }
            </div>
            <div className="basis-1/3 flex items-center justify-center">
              <Link
                to={`${PATH_NAMES.comments}/${post?.id}`}
                className="text-xs"
              >
                <div className="flex flex-col items-center justify-center text-chasescrollTextGrey">
                  <CommentsIcon />
                  {formatNumberWithK(post?.commentCount)} comments
                </div>
              </Link>
            </div>
            {/* <div className="basis-1/3 flex items-center justify-center">
              <div
                className="flex flex-col items-center justify-center text-chasescrollTextGrey"
                onClick={toggleShare}
              >
                <UploadIcon />
                <span className="cursor-pointer text-xs text-chasescrollTextGrey">
                  {formatNumberWithK(shareCount)} shares
                </span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
  )
})

export default Thread
