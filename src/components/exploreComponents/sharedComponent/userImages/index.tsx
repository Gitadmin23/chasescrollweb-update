// import React from 'react'

interface Props {
    data: any,
    size: string,
    font?: string
}

function UserImages(props: Props) {
    const {
        data,
        size,
        font
    } = props 

    return ( 
        <div className={` rounded-b-[64px] rounded-tl-[64px] border-[5px] border-[#D0D4EB] w-${size} h-${size} border `}> 
            {data?.data?.imgMain?.value &&  
                <img src={`https://chaseenv.chasescroll.com//resource-api/download/${data?.data?.imgMain?.value}`} alt="profiles" className="h-full w-full rounded-b-[64px] object-cover rounded-tl-[64px]" />
            }
            {!data?.data?.imgMain?.value && (
                <div className={` w-full h-full bg-chasescrollGray rounded-b-[64px] rounded-tl-[64px] flex justify-center items-center font-bold text-${font ? font : "[30px]" }`} >
                    {data?.firstName?.charAt(0).toUpperCase()}{data?.lastName?.charAt(0).toUpperCase()}
                </div>
            )}
    </div>
    )
}

export default UserImages
