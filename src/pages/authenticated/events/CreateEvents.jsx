import React, { useState } from "react"
import CreateEventsHeader from "@/components/events/CreateEventsHeader"
import EventTheme from "@/components/events/EventTheme"
import EventTicket from "@/components/events/EventTicket"
import EventInfo from "@/components/events/EventInfo"
import { CREATE_EVENT_HEADER } from "@/constants/index"
import { useAuth } from "../../../context/authContext"
import { useFetch } from "../../../hooks/useFetch"
import { useNavigate, useParams } from "react-router-dom"
import {
  CREATE_EVENT,
  CREATE_TICKET,
  UPLOAD_IMAGE,
} from "../../../constants/endpoints.constant"
import { toast } from "react-toastify"
import CreateEventTheme from "../../../components/createEventComponent/eventTheme"
import CreateEventInformation from "../../../components/createEventComponent/eventInformation"
import CreateEventTicket from "../../../components/createEventComponent/eventTicket"

const CreateEvents = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const { userName, userId, token, eventData } = useAuth()
  const { sendRequest } = useFetch()
  const [formData, setFormData] = useState({
    picUrls: [
      null
    ],
    eventType: null,
    eventName: "",
    eventDescription: "",
    joinSetting: "public",
    locationType: null,
    currency: "USD",
    currentPicUrl: null,
    eventFunnelGroupID: null,
    mediaType: null,
    currentVideoUrl: null,
    isPublic: true,
    isExclusive: false,
    mask: false,
    attendeesVisibility: true,
    minPrice: null,
    maxPrice: null,
    startTime: null,
    endTime: null,
    startDate: null,
    endDate: null,
    // expirationDate: null,
    location: {
      link: null,
      address: null,
      locationDetails: null,
      latlng: null,
      placeIds: null,
      toBeAnnounced: false
    },
    productTypeData: [
      // first is always standard
      {
        totalNumberOfTickets: null,
        ticketPrice: null,
        ticketType: null,
        minTicketBuy: null,
        maxTicketBuy: null
      },
    ]
  })

  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const { url } = useParams() 

  const handleContinue = () => {
    if (activeStep === 0) {
      if (!formData?.productTypeData[0]?.ticketType) {
        UploadImageData()
      } else { 
        setActiveStep(prevStep => prevStep + 1)
      } 
    } else if (activeStep === 1) {
      if (!formData?.productTypeData[0]?.ticketType) {
        UpdateEventFromDraft()
      }  else { 
        setActiveStep(prevStep => prevStep + 1)
      } 
    } else {
      if (window.location.href?.includes("/event/edit")) {
        handleSubmit()
      } else {
        CreateEventFromDraft()
      } 
    }
  }

  const handleBack = () => {
    setActiveStep(prevStep => prevStep - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)

    if (!image) {
      handleUpdatePayload(formData)
    } else {
      const fd = new FormData();
      fd.append("file", image);
      const response = await sendRequest(
        `${UPLOAD_IMAGE}${userId}`,
        "POST",
        fd,
        { Authorization: `Bearer ${token}` },
        true
      )
      let newObj = { ...formData, picUrls: [response?.fileName], currentPicUrl: response?.fileName }
      handleUpdatePayload(newObj)

    }
  }

  const handlerPayload = async (item) => {
    const response = await sendRequest(
      CREATE_EVENT,
      "POST",
      item,
      { Authorization: `Bearer ${token}` }
    )
    toast.success("Event Updated")
    navigate("/events")
  }

  const handleUpdatePayload = async (item) => {
    const response = await sendRequest(
      "events/update-event",
      "PUT",
      item,
      { Authorization: `Bearer ${token}` }
    )
    toast.success("Event Updated")
    navigate("/events")  
  }

  const handleChange = (index, name, value) => {
    const clone = { ...formData }
    if (clone.productTypeData.length - 1 < index) {
      clone.productTypeData = [...clone.productTypeData, {
        totalNumberOfTickets: null,
        ticketPrice: null,
        ticketType: "",
        minTicketBuy: null,
        maxTicketBuy: null
      },]
    }
    clone.productTypeData[index][name] = value

    setFormData(clone)
  };

  const handleChangeOther = ({ target: { name, value, type } }) => {
    if (name === "isPublic" || name === "attendeesVisibility") {
      setFormData(data => ({
        ...data,
        [name]: value === "true" ? true : false
      }));
    } else {
      setFormData(data => ({
        ...data,
        [name]: value
      }));
    }
  };

  const handleChangeRadio = ({ name, value }) => {
    setFormData(data => ({
      ...data,
      [name]: value
    }));
  };

  const HandleDeleteTicket = (item) => {

    let myArr = [...formData?.productTypeData]

    var index = myArr.findIndex(function (o) {
      return o.ticketType === item;
    })
    myArr.splice(index, 1);
    setFormData(data => ({
      ...data,
      productTypeData: myArr
    }))
  }

  const HandleAddTicket = (index) => {

    let myArr = [...formData?.productTypeData]
    myArr[index] = {
      totalNumberOfTickets: null,
      ticketPrice: null,
      ticketType: "",
      minTicketBuy: null,
      maxTicketBuy: null
    }

    setFormData(data => ({
      ...data,
      productTypeData: myArr
    }))
  }

  const HandleDeleteAllTicket = (name, price) => {
    setFormData(data => ({
      ...data,
      productTypeData: [{
        totalNumberOfTickets: null,
        ticketPrice: price,
        ticketType: name,
        minTicketBuy: null,
        maxTicketBuy: null
      }]
    }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0] 
    if (file) {
      setImage(file)
      setSelectedImage(file.name);
    }
  }

  React.useEffect(() => {
    if (eventData?.eventName) {
      setFormData({
        id: eventData?.id,
        picUrls: eventData?.picUrls,
        eventType: eventData?.eventType,
        eventName: eventData?.eventName,
        eventDescription: eventData?.eventDescription,
        joinSetting: eventData?.joinSetting,
        locationType: eventData?.locationType,
        currency: eventData?.currency,
        currentPicUrl: eventData?.currentPicUrl,
        eventFunnelGroupID: eventData?.eventFunnelGroupID,
        mediaType: eventData?.mediaType,
        currentVideoUrl: eventData?.currentVideoUrl,
        isPublic: eventData?.isPublic,
        isExclusive: eventData?.isExclusive,
        mask: eventData?.mask,
        attendeesVisibility: eventData?.attendeesVisibility,
        minPrice: eventData?.minPrice,
        maxPrice: eventData?.maxPrice,
        startTime: eventData?.startTime,
        endTime: eventData?.endTime,
        startDate: eventData?.startDate,
        endDate: eventData?.endDate,
        // expirationDate: eventData?.,
        location: eventData?.location,
        productTypeData: eventData?.productTypeData
      })
    }
  }, [])

  const UploadImageData = async () => {
    setLoading(true)

    if (!image && formData?.currentPicUrl) {
      UpdateEventFromDraft()
    } else if (image && formData?.currentPicUrl) {

      const fd = new FormData();
      fd.append("file", image);
      const response = await sendRequest(
        `${UPLOAD_IMAGE}${userId}`,
        "POST",
        fd,
        { Authorization: `Bearer ${token}` },
        true
      )
      let newObj = { ...formData, picUrls: [response?.fileName], currentPicUrl: response?.fileName }
      UpdateEventFromDraftWithImage(newObj)
    } else {
      const fd = new FormData();
      fd.append("file", image);
      const response = await sendRequest(
        `${UPLOAD_IMAGE}${userId}`,
        "POST",
        fd,
        { Authorization: `Bearer ${token}` },
        true
      )
      let newObj = { ...formData, picUrls: [response?.fileName], currentPicUrl: response?.fileName }
      SaveToDraft(newObj)
    }
  }

  const SaveToDraft = async (item) => {
    setLoading(true)
    const response = await sendRequest(
      "/events/create-draft",
      "POST",
      item,
      { Authorization: `Bearer ${token}` }
    )
    setFormData(response)
    toast.success("Event Saved")
    setLoading(false)
    setActiveStep(prevStep => prevStep + 1)
  }



  const UpdateEventFromDraftWithImage = async (data) => {
    setLoading(true)
    const response = await sendRequest(
      "/events/update-draft",
      "PUT",
      data,
      { Authorization: `Bearer ${token}` }
    ) 
    setFormData({ ...formData, createdBy: userId, lastModifiedBy: userId })
    toast.success("Event Saved")
    setActiveStep(prevStep => prevStep + 1)
    setLoading(false)
  }

  const UpdateEventFromDraft = async () => {
    setLoading(true)
    const response = await sendRequest(
      "/events/update-draft",
      "PUT",
      formData,
      { Authorization: `Bearer ${token}` }
    ) 
    setFormData({ ...formData, createdBy: userId, lastModifiedBy: userId })
    toast.success("Event Saved")
    setActiveStep(prevStep => prevStep + 1)
    setLoading(false)
  }

  const CreateEventFromDraft = async () => {
    setLoading(true)
    const response = await sendRequest(
      "/events/create-event-from-draft",
      "POST",
      formData,
      { Authorization: `Bearer ${token}` }
    )
    toast.success("Event Created")
    navigate("/events") 
    setLoading(false)
  }


  return (
    <div className="flex flex-col gap-2 md:px-16 pt-8">
      <CreateEventsHeader
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        formData={formData}
      />
      <div className="w-full">
        {activeStep === 0 && (
          <div>
            <CreateEventTheme
              formData={formData}
              handleChange={handleChangeOther}
              handleChangeRadio={handleChangeRadio}
              handleFileChange={handleFileChange}
              handleContinue={handleContinue}
              SaveToDraft={UploadImageData}
              loading={loading}
            />
          </div>
        )}
        {activeStep === 1 && (
          <div>
            <CreateEventInformation
              handleChange={handleChangeOther}
              formData={formData}
              handleContinue={handleContinue}
              handleBack={handleBack}
              setFormData={setFormData}
              UpdateDaft={UpdateEventFromDraft}
              loading={loading}
            />
          </div>
        )}
        {activeStep === 2 && (
          <div>
            <CreateEventTicket
              loading={loading}
              HandleDeleteAllTicket={HandleDeleteAllTicket}
              handleChange={handleChange}
              handleChangeOther={handleChangeOther}
              formData={formData}
              HandlerDeleteTicket={HandleDeleteTicket}
              setFormData={setFormData}
              handleSubmit={handleContinue}
              HandleAddTicket={HandleAddTicket}
              handleBack={handleBack}
              brought={eventData}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default CreateEvents
