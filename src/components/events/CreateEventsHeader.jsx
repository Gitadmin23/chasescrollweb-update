import PropTypes from "prop-types"
import { CREATE_EVENT_HEADER } from "@/constants/index"
import { CancelIcon } from "@/components/Svgs"

const CreateEventsHeader = ({ activeStep, setActiveStep, formData }) => {
  const handleClose = () => {
    window.close()
    window.history.back()
  }

  const getValidationInfo =()=> {

    if(!formData?.startDate){
      return true
    } else if(!formData?.endDate){
      return true
    } else if(!formData?.location?.toBeAnnounced){
      if(!formData?.location?.locationDetails && !formData?.location?.link){
       return true
     }
    } else {
      return false      
    } 
  }

  const getValidationTheme =()=> {
    if(!formData?.eventName){
      return true
    } else if(!formData?.eventType){
      return true
    } else if(!formData?.eventDescription){ 
      return true
    } else {
      return false   
    }
  }

  return (
    <div className="flex flex-col gap-2 md:gap-8 w-full">
      <div className="flex gap-4 items-center w-full pl-2">
        <button onClick={handleClose}>
          <CancelIcon />
        </button>
        <h1 className="text-lg font-bold">{!window.location.href?.includes("/event/edit") ? "Create" : "Edit"} Events</h1>
      </div>

      <div className="flex gap-4 justify-evenly md:justify-between w-full">
        {CREATE_EVENT_HEADER.map(({ label, value }) => {
          const isActive = activeStep === value
          
          return (
            <button
              key={value}
              disabled={label === "Information" ? getValidationTheme():label === "Tickets" ? getValidationInfo() : false}
              className={`text-sm md:text-base md:p-2 md:px-8 px-2 ${isActive
                ? "text-chasescrollBlue"
                : "text-gray-300 hover:bg-gray-50 hover:text-chasescrollBlue"
                }`}
              onClick={() => setActiveStep(value)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

CreateEventsHeader.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
  activeTab: PropTypes.string.isRequired,
}

export default CreateEventsHeader
