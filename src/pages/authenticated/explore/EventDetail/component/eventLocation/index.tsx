// import React from 'react'
import LocationDetail from '../../../../../../components/exploreComponents/loctionDetail'
import {LocationIcon } from '../../../../../../components/Svgs' 

interface Props {
    location: any,
    locationType: string, 
}

function EventLocation(props: Props) {
    const {
        location,
        locationType
    } = props

    return ( 
        <div className=' pb-2  w-full flex flex-col border-b rounded-b-lg  px-4  ' >
            <p className=' text-[18px] mt-4 font-bold ' >Event location</p>
            <div className=' flex w-full items-center gap-3 mt-3 ' >
                <LocationIcon className="" />
                <div className='  ' >
                    <LocationDetail location={location} locationType={locationType} length={200} style={' font-bold text-[#3C41F0]'}  /> 
                </div>
            </div>
        </div>
    )
}

export default EventLocation
