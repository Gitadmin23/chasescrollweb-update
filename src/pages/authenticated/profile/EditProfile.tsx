import React, { useCallback, useRef, useState } from "react"
import { toast } from "react-toastify";
import davido from "@/assets/images/davido.png"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "../../../components/Svgs"
import PageWrapper from "../../../components/PageWrapper"
import { previousPage } from "../../../constants/index"
import { useFetch } from "../../../hooks/useFetch"
import { useAuth } from "../../../context/authContext"
import { UPDATE_PROFILE, UPLOAD_IMAGE } from "../../../constants/endpoints.constant"
import ButtonSpinner from "../../../components/ButtonSpinners";
import { useMutation, useQuery, useQueryClient } from 'react-query'
import httpService from "../../../utils/httpService";
import { Avatar } from '@chakra-ui/react'
import CONFIG from "../../../config";
import UserImages from "../../../components/exploreComponents/sharedComponent/userImages";
import { MdCamera, MdPhoto, MdPhotoCamera } from "react-icons/md";

function EditProfile() {
  const { token, userId } = useAuth()

  const [userProfile, setUserProfile] = useState({
    firstName: "",
    lastName: "",
    username: "",
    website: "",
    about: "",
    image: '',
    publicProfile: false,
    mobilePhone: '',
    gender: '' 
  });
  const [loading, setLoading] = React.useState(false);

  const ref = useRef<HTMLInputElement>();
  const queryClient = useQueryClient();

  const { isLoading: profileLoading, data, refetch } = useQuery(['getUserDetails', userId], () => httpService.get(`/user/publicprofile/${userId}`),{
    onError: (error: any) => {
      toast.error(error.response?.data);
    },
    onSuccess: (data) => { 
      setUserProfile({
        firstName: data.data.firstName,
        lastName: data.data.lastName,
        username: data.data.username,
        website: data.data.data.webAddress?.value || '',
        about: data.data.data.about?.value || '',
        image: data.data.data.imgMain?.value || '',
        publicProfile: data.data.publicProfile, 
        mobilePhone: data.data.data.mobilePhone?.value || '',
        gender: data.data.data.gender?.value || '' 
      })
    }
  });

  const uploadProfileImage = useMutation({
    mutationFn: (data: string) => httpService.put(`/user/update-main-profile-image?profileImageRef=${data}`),
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any) => { 
      toast.success("Profile image updated");
      queryClient.invalidateQueries(['getUserDetails']);
    }
  });

  const { isLoading: imageUploading, mutate} = useMutation({
    mutationFn: (data: FormData) => httpService.post(`${UPLOAD_IMAGE}/${userId}`, data),
    onError: (error: any) => {
      console.log(error);
    },
    onSuccess: (data: any) => { 
      refetch()
      uploadProfileImage.mutate(data.data.fileName);
    }
  });


  
  const [expanded, setExpanded] = useState(true)
  const [component, setComponent] = useState(false)

  const { sendRequest, isLoading } = useFetch()

  const handleChange = ({ target: { name, value } }) => {
    setUserProfile(info => ({
      ...info,
      [name]: value,
    }))
  }

  const handleExpandClick = () => {
    setComponent(!component)
    setExpanded(!expanded)
  }  

  const updateUserProfile = async event => {
    event.preventDefault()
    const {
      firstName,
      lastName,
      username,
      website,
      about,publicProfile
    } = userProfile
    setLoading(true); 
    const data = await sendRequest(
      UPDATE_PROFILE,
      "PUT",
      {
        firstName,
        lastName,
        username,
        data: {
          webAddress: {
            objectPublic: website ? true: publicProfile,
            value: website
          },
          about: {
            objectPublic: about ? true: publicProfile,
            value: about
          },
          imgMain: {
            objectPublic: userProfile?.image ? true: publicProfile,
            value: userProfile?.image
          },
          mobilePhone: {
            objectPublic: userProfile?.mobilePhone ? true: false,
            value: userProfile?.mobilePhone ,
          },
          gender: {
            objectPublic: userProfile?.gender ? true: false,
            value: userProfile?.mobilePhone,
          }, 
        }
      },
      { Authorization: `Bearer ${token}` }
    )
    if (data) { 
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries(['getUserDetails']);
    } else {
      toast.error('Something went wrong!');
    }
    setLoading(false);
  }

  const handleFilePicker = useCallback((file: FileList) => { 
    const formData = new FormData();
    formData.append('file', file[0]);
    mutate(formData);
  }, [mutate])  

  return (
    <PageWrapper>
      {() => ( 
        <div className=" mb-[100px] w-full items-center justify-center flex flex-col p-4 bg-white">
          <input ref={ref as any} type="file" accept='image/*' hidden onChange={(e) => handleFilePicker(e.target.files as FileList)} />

          <div className="flex items-center w-full mb-4 p-2 ">
            <span
              className="pr-6 text-gray-500 cursor-pointer"
              onClick={() => previousPage()}
            >
              {" "}
              {ChevronLeft()}{" "}
            </span>
            <p className="text-chasescrollTextGrey text-lg">Edit Profile</p>
          </div>
          <form onSubmit={updateUserProfile} className="w-full sm:w-1/2 overflow-auto">
            <div className="flex flex-col justify-center items-center mb-4">
              {/* <img
                src={davido}
                alt="Profile Image"
                className="w-1/4 h-25 rounded-b-[32px] rounded-tl-[32px]"
              /> */}
              {/* <Avatar 
                src={`${CONFIG.RESOURCE_URL}${userProfile.image}`}
                name={`${userProfile.firstName} ${userProfile.lastName}`}
                size='2xl'
                className="w-1/4 h-25 rounded-b-[32px] rounded-tl-[32px] cursor-pointer"
                onClick={() => ref.current?.click()}
              />
              { imageUploading || uploadProfileImage.isLoading && <p>image uploading....</p>} */}
              {/* { uploadProfileImage.isLoading && <p>image uploading....</p>} */} 
              <div 
                onClick={() => ref.current?.click()}
                className=" cursor-pointer  rounded-b-[64px] rounded-tl-[64px] relative " >

                <div className=" w-full h-full rounded-b-[64px] rounded-tl-[64px] bg-black z-20 bg-opacity-25  absolute inset-0 flex justify-center items-center " >
                    <MdPhotoCamera size={"32px"} color="white" />
                  </div>
					      <UserImages data={data?.data} size={"32"} font='[26px]' />
              </div>
              { imageUploading || uploadProfileImage.isLoading && <p>image uploading....</p>}
            </div>
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={userProfile.firstName}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-lg w-full"
                placeholder="Enter your First name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={userProfile.lastName}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-lg w-full"
                placeholder="Enter your Last name"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={userProfile.username}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-lg w-full"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="website"
                className="block font-medium text-gray-700 mb-2"
              >
                Website
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={userProfile.website}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-lg w-full"
                placeholder="Enter your website"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="about"
                className="block font-medium text-gray-700 mb-2"
              >
                About Me
              </label>
              <input
                type="text"
                id="about"
                name="about"
                value={userProfile.about}
                onChange={handleChange}
                className="border border-gray-400 p-2 rounded-lg w-full"
                placeholder="Enter text here..."
              />
            </div>
            <Link to="/personal-information">
              <div
                className="mb-4 flex items-center justify-between cursor-pointer"
                onClick={handleExpandClick}
              >
                <button
                  type="button"
                  className="font-bold text-blue-500 py-2 rounded-lg"
                >
                  Personal Information
                </button>
                <span className=" pr-2 text-blue-500"> {ChevronRight()} </span>
              </div>
            </Link>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-white border border-blue-500 text-blue-500 py-2 px-4 rounded-lg"
              >
                {loading ? <ButtonSpinner /> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageWrapper>
  )
}

export default EditProfile
