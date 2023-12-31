import { ThreeDots } from "react-loader-spinner"

const Loader = (props) => {

  const {
    position
  } = props

  return( 
    <div className={` ${position && " pt-20 "} bg-white bg-opacity-30 absolute inset-0 flex justify-center items-center`}>
      <ThreeDots
        height="50"
        width="200"
        radius="100"
        color="#5D70F9"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  )
}

export default Loader
