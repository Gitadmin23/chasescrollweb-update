// import React from 'react'

interface Props {
    location: any,
    locationType: any
    style: string,
    length?: number
}

function LocationDetail(props: Props) {
    const {
        location,
        // locationType,
        style,
        length
    } = props 

    return (
        <div>
            {location?.locationDetails && (
                <p className={style} >{location.locationDetails?.length >= (length ? length : 17) ? location?.locationDetails.slice(0, (length ? length : 17)) + "..." : location?.locationDetails}</p>
            )} 
            {location?.toBeAnnounced && (
                <p className={style}>To Be Announced</p>
            )}
            {location?.link && (
                <a href={location?.link} target="_blank" className=' font-bold text-sm text-chasescrollBlue ' >Join Online</a>
            )}
        </div>
    )
}

export default LocationDetail
