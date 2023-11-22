import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import CONFIG from "../../../config"
import { Link, useParams } from "react-router-dom"
import { PATH_NAMES } from "../../../constants/paths.constant"
import UserPosts from "./UserPosts"
import { useFetch } from "../../../hooks/useFetch"
import { GET_USER_MEDIA_POSTS } from "../../../constants/endpoints.constant"
import { useAuth } from "../../../context/authContext"
import useInfinteScroller from "../../../hooks/useInfinteScroller"
import { Spinner, HStack, Box } from "@chakra-ui/react";
import { FiPlayCircle } from 'react-icons/fi'
import InfiniteScrollerComponent from "../../../hooks/infiniteScrollerComponent"

const Posts = () => {
  const [showUserPosts, setShowUserPosts] = useState(false)
  const [postID, setPostID] = useState(null)
  const { userId } = useParams()
  const { sendRequest } = useFetch()
  const [posts, setPosts] = useState([])
  const { token, userId: currentUserId } = useAuth()

  const self = userId === currentUserId

  const openUserPosts = (event) => {
    setShowUserPosts(true)
  }

  const closeUserPosts = (event) => {
    if (event.target.id === "overlay") {
      setShowUserPosts(false)
    }
  }

  // const fetchPosts = async () => {
  //   const data = await sendRequest(
  //     `${GET_USER_MEDIA_POSTS}?userID=${userId}`,
  //     "GET",
  //     null,
  //     { Authorization: `Bearer ${token}` }
  //   )
  //   if (data) setPosts(data) 
  // }

  // useEffect(()=>{
  //   fetchPosts()
  // }, []) 

  const [page, setPage] = React.useState(0)

  const {isLoading, results, ref} = InfiniteScrollerComponent({url: '/feed/get-users-media-posts?userID=' + userId, limit: 10, filter: "id"})
  // const { results, isLoading, lastChildRef } = useInfinteScroller({ url: '/feed/get-users-media-posts?userID=' + userId, pageNumber: page, setPageNumber: setPage, })

  console.log(results)

  const content = results.map((post, index) => {
    if (index === results.length - 1) {
      return (
        <Box ref={ref} key={index.toString()} position={'relative'} zIndex={5}>
          {post.type === 'WITH_IMAGE' && post?.mediaRef &&
            <img
              key={index.toString()}
              src={post.mediaRef?.includes("https:") ? post?.mediaRef : `${CONFIG.RESOURCE_URL}${post?.mediaRef}`}
              className="rounded-b-[32px] rounded-tl-[32px] w-[170px] h-[170px] object-cover cursor-pointer"
              alt="media from user post"
              onClick={() => {
                openUserPosts()
                setPostID(post?.id)
              }}
            />
          }
          {post.type === 'WITH_VIDEO_POST' && post?.mediaRef &&
            <video
              key={index.toString()}
              className="rounded-b-[32px] rounded-tl-[32px] w-[170px] h-[170px] object-cover cursor-pointer z-0"
              alt="media from user post"
              onClick={() => {
                openUserPosts()
                setPostID(post?.id)
              }}
              controls
              autoPlay={false}
            >
              <source src={`${CONFIG.RESOURCE_URL}${post?.mediaRef}`} type="video/mp4" />
            </video>
          }
          {
            post.type === 'WITH_VIDEO_POST' && (
              <HStack
                onClick={() => {
                  openUserPosts()
                  setPostID(post?.id)
                }}
                position={'absolute'} zIndex={10} fontSize={40} top={'62px'} left={'62px'} cursor={'pointer'} >
                <FiPlayCircle color='white' fontSize={50} />
              </HStack>
            )
          }
        </Box>
      )
    } else {
      return (
        <Box key={index.toString()} position={'relative'} zIndex={5}>
          {post.type === 'WITH_IMAGE' && post?.mediaRef &&
            <img
              key={index.toString()}
              src={post?.mediaRef?.includes("https") ? post?.mediaRef : `${CONFIG.RESOURCE_URL}${post?.mediaRef}`}
              className="rounded-b-[32px] rounded-tl-[32px] w-[170px] h-[170px] object-cover cursor-pointer"
              alt="media from user post"
              onClick={() => {
                openUserPosts()
                setPostID(post?.id)
              }}
            />
          }
          {post.type === 'WITH_VIDEO_POST' && post?.mediaRef &&
            <video
              key={index.toString()}
              className="rounded-b-[32px] rounded-tl-[32px] w-[170px] h-[170px] object-cover cursor-pointer z-0"
              alt="media from user post"
              onClick={() => {
                openUserPosts()
                setPostID(post?.id)
              }}
              controls={false}
              autoPlay={false}
            >
              <source src={`${CONFIG.RESOURCE_URL}${post?.mediaRef}`} type="video/mp4" />
            </video>
          }
          {post.type === 'WITH_VIDEO_POST' && (
            <HStack
              onClick={() => {
                openUserPosts()
                setPostID(post?.id)
              }}
              position={'absolute'} zIndex={10} fontSize={40} top={'62px'} left={'62px'} cursor={'pointer'} >
              <FiPlayCircle color='white' fontSize={50} />
            </HStack>
          )}
        </Box>
      )
    }
  })


  return (
    <section className="mb-[100px] flex-col flex items-center">

      {showUserPosts && (
        <UserPosts
          toggleUserPosts={closeUserPosts}
          userID={userId}
          postID={postID}
        />
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center w-fit">
        {content}
      </div>


      {isLoading && (
        <div className="w-full h-32 flex justify-center items-center">
          <Spinner size='md' color='brand.chasescrollButtonBlue' />
        </div>
      )}
    </section>
  )
}

Posts.propTypes = {
  posts: PropTypes.array
}

export default Posts
